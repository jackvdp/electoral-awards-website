import React, { useState, ChangeEvent, FormEvent, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import useProgressbar from 'hooks/useProgressbar';
import { AwardCategory, categories } from 'data/award-categories';
import Link from 'next/link';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { trackEvent, trackError } from 'helpers/analytics';

interface FormData {
    nominatorName: string;
    nominatorOrganization: string;
    nominatorPosition: string;
    email: string;
    nominatorPhone: string;
    nomineeName: string;
    nomineePosition: string;
    nomineeOrganization: string;
    nomineeEmail: string;
    nomineePhone: string;
    awardCategory: string;
    initiativeDescription: string;
    supportingEvidence: string;
    referenceName: string;
    referencePosition: string;
    referenceOrganization: string;
    referenceEmail: string;
    referencePhone: string;
    additionalDocuments: File[];
}

interface FormErrors {
    [key: string]: string;
}

// The whole submission travels as one request, and the platform rejects any
// request body over 4.5MB before our API route ever runs. Attachments therefore
// have to fit inside that, with room left for the form's text fields and the
// multipart overhead. Keep these in step with the limits in the API routes.
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB per file
const MAX_TOTAL_UPLOAD_SIZE = 4 * 1024 * 1024; // 4MB across all attachments
const SUPPORT_EMAIL = 'info@electoralnetwork.org';
const ALLOWED_FILE_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png'
];

const DRAFT_KEY = 'awardFormDraft';
const DRAFT_MAX_AGE_HRS = 24;

// Word-count thresholds for the free-text fields.
const DESC_MIN_WORDS = 50;
const DESC_MAX_WORDS = 200;
const EVIDENCE_MIN_WORDS = 150;
const EVIDENCE_MAX_WORDS = 1000;

const steps = 5;
const stepTitles = ['Nominator', 'Nominee', 'Award & Description', 'Reference', 'Documents'];

const emptyFormData: FormData = {
    nominatorName: '',
    nominatorOrganization: '',
    nominatorPosition: '',
    email: '',
    nominatorPhone: '',
    nomineeName: '',
    nomineePosition: '',
    nomineeOrganization: '',
    nomineeEmail: '',
    nomineePhone: '',
    awardCategory: '',
    initiativeDescription: '',
    supportingEvidence: '',
    referenceName: '',
    referencePosition: '',
    referenceOrganization: '',
    referenceEmail: '',
    referencePhone: '',
    additionalDocuments: [],
};

const countWords = (text: string): number =>
    text.trim() === '' ? 0 : text.trim().split(/\s+/).length;

const formatBytes = (bytes: number): string =>
    bytes < 1024 * 1024
        ? `${Math.max(1, Math.round(bytes / 1024))}KB`
        : `${(bytes / (1024 * 1024)).toFixed(1)}MB`;

// Failed requests come back in more than one shape. Our own API routes send
// { error: 'a sentence' }, but a request rejected by the hosting platform before
// it reaches them sends a nested { error: { code, message } }. Dig out the first
// string we can find, so an object never reaches the page as "[object Object]".
const readErrorMessage = (payload: unknown): string | null => {
    if (typeof payload === 'string') return payload.trim() || null;
    if (!payload || typeof payload !== 'object') return null;
    const source = payload as Record<string, unknown>;
    for (const candidate of [source.error, source.message, source.detail]) {
        const message = readErrorMessage(candidate);
        if (message) return message;
    }
    return null;
};

// Turn a failed response into something the nominator can act on.
const describeResponseError = (status: number, payload: unknown): string => {
    if (status === 413) {
        return `Your attached documents are too large to send. Please keep them under ${formatBytes(MAX_TOTAL_UPLOAD_SIZE)} in total, then submit again. If you need to send larger files, submit the nomination without them and email them to ${SUPPORT_EMAIL}.`;
    }
    return (
        readErrorMessage(payload) ||
        `Your nomination could not be submitted (error ${status}). Please try again, and email ${SUPPORT_EMAIL} if the problem continues.`
    );
};

// Centralized error alert component
const ErrorAlert: React.FC<{ errors: string | string[] }> = ({ errors }) => {
    const errorList = Array.isArray(errors) ? errors : [errors];
    return (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <h5 className="alert-heading">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                Please correct the following:
            </h5>
            <ul className="mb-0">
                {errorList.map((error, idx) => (
                    <li key={idx}>{error}</li>
                ))}
            </ul>
        </div>
    );
};

// Live word counter shown beneath the free-text fields.
const WordCounter: React.FC<{ count: number; min: number; max: number }> = ({ count, min, max }) => {
    let className = 'text-success';
    let message = `${count} words`;
    if (count < min) {
        className = 'text-danger';
        message = `${count} of ${min} words minimum`;
    } else if (count > max) {
        className = 'text-warning';
        message = `${count} words (over the ${max}-word guideline)`;
    }
    return (
        <div className={`small mt-1 ${className}`} aria-live="polite">
            {message}
        </div>
    );
};

// Red asterisk for required field labels.
const Required: React.FC = () => <span className="text-danger ms-1" aria-hidden="true">*</span>;

// An existing, already-uploaded document (from a saved nomination) when editing.
interface ExistingDocument {
    name: string;
    url: string;
    size: number;
    contentType: string;
}

interface ApplicationFormProps {
    editId?: string;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ editId }) => {
    const isEditMode = !!editId;
    const router = useRouter();
    const [step, setStep] = useState<number>(1);
    const cardRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Edit mode: documents already saved on the record, kept unless removed here.
    const [existingDocuments, setExistingDocuments] = useState<ExistingDocument[]>([]);
    const [editLoading, setEditLoading] = useState<boolean>(isEditMode);
    const [editLoadError, setEditLoadError] = useState<string | null>(null);

    const [formData, setFormData] = useState<FormData>(emptyFormData);

    const [errors, setErrors] = useState<FormErrors>({});
    const [attemptedNext, setAttemptedNext] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);

    // Draft handling: hold any saved draft until the user chooses to restore or discard.
    const [isHydrated, setIsHydrated] = useState(false);
    const [pendingDraft, setPendingDraft] = useState<{ formData: FormData; currentStep: number } | null>(null);

    useProgressbar(submitSuccess ? 100 : progress);

    // Only newly selected files are uploaded; in edit mode the documents already
    // stored are passed by reference, so they do not count towards the limit.
    const totalUploadSize = formData.additionalDocuments.reduce((sum, file) => sum + file.size, 0);

    // Show specific field errors
    const getFieldError = (fieldName: string) => {
        return errors[fieldName] && attemptedNext ? (
            <div className="invalid-feedback d-block">
                {errors[fieldName]}
            </div>
        ) : null;
    };

    const isInvalid = (fieldName: string) => !!errors[fieldName] && attemptedNext;

    const scrollToTop = () => {
        if (cardRef.current) {
            cardRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const validateEmail = (email: string): boolean => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(email);
    };

    const validatePhone = (phone: string): boolean => {
        return /^\+?\d+$/.test(phone);
    };

    const isNonEmptyString = (value: string): boolean => {
        return value.trim().length > 0;
    };

    // Check overall submission readiness
    useEffect(() => {
        const complete =
            isNonEmptyString(formData.nominatorName) &&
            isNonEmptyString(formData.nominatorOrganization) &&
            isNonEmptyString(formData.nominatorPosition) &&
            validateEmail(formData.email) &&
            validatePhone(formData.nominatorPhone) &&
            isNonEmptyString(formData.nomineeName) &&
            validateEmail(formData.nomineeEmail) &&
            validatePhone(formData.nomineePhone) &&
            isNonEmptyString(formData.awardCategory) &&
            countWords(formData.initiativeDescription) >= DESC_MIN_WORDS &&
            countWords(formData.supportingEvidence) >= EVIDENCE_MIN_WORDS;
        setIsReadyToSubmit(complete && step === steps);
    }, [formData, step]);

    // Update progress bar
    useEffect(() => {
        setProgress(((step - 1) / steps) * 100);
    }, [step]);

    // Edit mode: fetch the existing nomination and pre-fill the form.
    useEffect(() => {
        if (!editId) return;
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch(`/api/nominations/${editId}`);
                if (!res.ok) {
                    throw new Error(res.status === 404
                        ? 'We could not find that nomination, or it is not yours to edit.'
                        : 'Could not load the nomination.');
                }
                const { data } = await res.json();
                if (cancelled) return;
                setFormData({
                    ...emptyFormData,
                    nominatorName: data.nominatorName ?? '',
                    nominatorOrganization: data.nominatorOrganization ?? '',
                    nominatorPosition: data.nominatorPosition ?? '',
                    email: data.email ?? '',
                    nominatorPhone: data.nominatorPhone ?? '',
                    nomineeName: data.nomineeName ?? '',
                    nomineePosition: data.nomineePosition ?? '',
                    nomineeOrganization: data.nomineeOrganization ?? '',
                    nomineeEmail: data.nomineeEmail ?? '',
                    nomineePhone: data.nomineePhone ?? '',
                    awardCategory: data.awardCategory ?? '',
                    initiativeDescription: data.initiativeDescription ?? '',
                    supportingEvidence: data.supportingEvidence ?? '',
                    referenceName: data.referenceName ?? '',
                    referencePosition: data.referencePosition ?? '',
                    referenceOrganization: data.referenceOrganization ?? '',
                    referenceEmail: data.referenceEmail ?? '',
                    referencePhone: data.referencePhone ?? '',
                });
                setExistingDocuments(Array.isArray(data.documents) ? data.documents : []);
            } catch (err) {
                if (!cancelled) setEditLoadError(err instanceof Error ? err.message : 'Could not load the nomination.');
            } finally {
                if (!cancelled) setEditLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [editId]);

    // Load draft on mount (defer applying it until the user decides). Skipped when editing.
    useEffect(() => {
        if (isEditMode) return;
        try {
            const draft = localStorage.getItem(DRAFT_KEY);
            if (draft) {
                const { formData: savedData, currentStep, savedAt } = JSON.parse(draft);
                const hasData = Object.entries(savedData).some(([k, v]) =>
                    k === 'additionalDocuments'
                        ? Array.isArray(v) && v.length > 0
                        : typeof v === 'string' && v.trim() !== ''
                );
                const ageHrs = (Date.now() - new Date(savedAt).getTime()) / (1000 * 60 * 60);

                if (hasData && ageHrs < DRAFT_MAX_AGE_HRS) {
                    setPendingDraft({
                        formData: { ...savedData, additionalDocuments: [] },
                        currentStep: currentStep || 1,
                    });
                } else if (ageHrs >= DRAFT_MAX_AGE_HRS) {
                    localStorage.removeItem(DRAFT_KEY);
                }
            }
        } catch {
            console.error('Error loading draft');
        }
        setIsHydrated(true);
    }, [isEditMode]);

    // Autosave. Paused until hydration finishes and any pending draft is resolved,
    // so we never overwrite a saved draft before the user acts on the restore banner.
    useEffect(() => {
        if (isEditMode || !isHydrated || pendingDraft) return;
        const timer = setTimeout(() => {
            const hasData = Object.entries(formData).some(([k, v]) =>
                k === 'additionalDocuments'
                    ? Array.isArray(v) && v.length > 0
                    : typeof v === 'string' && v.trim() !== ''
            );
            if (!hasData) return; // nothing worth saving yet
            localStorage.setItem(
                DRAFT_KEY,
                JSON.stringify({ formData, currentStep: step, savedAt: new Date().toISOString() })
            );
            setLastSaved(new Date());
        }, 1000);
        return () => clearTimeout(timer);
    }, [formData, step, isHydrated, pendingDraft, isEditMode]);

    const restoreDraft = () => {
        if (!pendingDraft) return;
        setFormData(pendingDraft.formData);
        setStep(pendingDraft.currentStep);
        setPendingDraft(null);
        scrollToTop();
    };

    const discardDraft = () => {
        localStorage.removeItem(DRAFT_KEY);
        setPendingDraft(null);
    };

    // Real-time validation on input change
    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));

        // Real-time email validation
        if (['email', 'nomineeEmail', 'referenceEmail'].includes(name)) {
            if (value && !validateEmail(value)) {
                setErrors(prev => ({ ...prev, [name]: 'Invalid email format' }));
            }
        }
        // Real-time phone validation
        if (['nominatorPhone', 'nomineePhone', 'referencePhone'].includes(name)) {
            if (value && !validatePhone(value)) {
                setErrors(prev => ({ ...prev, [name]: 'Invalid phone format (e.g., +1234567890)' }));
            }
        }
    };

    // File upload with type, per-file size and total-size checks. Files that pass
    // are kept even if others fail, so one bad file does not discard the rest.
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            const newFiles = Array.from(e.target.files);
            const valid: File[] = [];
            const fileErrors: string[] = [];
            let runningTotal = totalUploadSize;

            newFiles.forEach(file => {
                if (!ALLOWED_FILE_TYPES.includes(file.type)) {
                    fileErrors.push(`${file.name}: invalid file type. Allowed: PDF, DOC, DOCX, JPG, PNG.`);
                } else if (file.size > MAX_FILE_SIZE) {
                    fileErrors.push(`${file.name} is ${formatBytes(file.size)}, over the ${formatBytes(MAX_FILE_SIZE)} limit for a single file.`);
                } else if (runningTotal + file.size > MAX_TOTAL_UPLOAD_SIZE) {
                    fileErrors.push(`${file.name} (${formatBytes(file.size)}) would take your attachments over the ${formatBytes(MAX_TOTAL_UPLOAD_SIZE)} total. Remove another file, or email it to ${SUPPORT_EMAIL} instead.`);
                } else {
                    runningTotal += file.size;
                    valid.push(file);
                }
            });

            setErrors(prev => ({ ...prev, fileUpload: fileErrors.join('\n') }));
            if (valid.length) {
                setFormData(prev => ({
                    ...prev,
                    additionalDocuments: [...prev.additionalDocuments, ...valid],
                }));
            }
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleFileDelete = (idx: number) => {
        setFormData(prev => ({
            ...prev,
            additionalDocuments: prev.additionalDocuments.filter((_, i) => i !== idx),
        }));
        // Removing a file may be what the previous warning asked for.
        setErrors(prev => ({ ...prev, fileUpload: '' }));
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleExistingDocumentDelete = (idx: number) => {
        setExistingDocuments(prev => prev.filter((_, i) => i !== idx));
    };

    // Summary of missing fields per step
    const getStepValidationSummary = (currentStep: number): string[] => {
        const missing: string[] = [];
        if (currentStep === 1) {
            if (!formData.nominatorName) missing.push('Nominator name');
            if (!formData.nominatorOrganization) missing.push('Organization');
            if (!formData.nominatorPosition) missing.push('Position');
            if (!formData.email) missing.push('Email');
            if (!formData.nominatorPhone) missing.push('Phone');
        }
        if (currentStep === 2) {
            if (!formData.nomineeName) missing.push('Nominee name');
            if (!formData.nomineeEmail) missing.push('Email');
            if (!formData.nomineePhone) missing.push('Phone');
        }
        if (currentStep === 3) {
            if (!formData.awardCategory) missing.push('Category');
            if (countWords(formData.initiativeDescription) < DESC_MIN_WORDS) missing.push(`Initiative description (min ${DESC_MIN_WORDS} words)`);
            if (countWords(formData.supportingEvidence) < EVIDENCE_MIN_WORDS) missing.push(`Supporting evidence (min ${EVIDENCE_MIN_WORDS} words)`);
        }
        return missing;
    };

    // Validate one step
    const validateStep = (currentStep: number): boolean => {
        const newErrors: FormErrors = {};
        switch (currentStep) {
            case 1:
                if (!formData.nominatorName) newErrors.nominatorName = 'Required';
                if (!formData.nominatorOrganization) newErrors.nominatorOrganization = 'Required';
                if (!formData.nominatorPosition) newErrors.nominatorPosition = 'Required';
                if (!formData.email) newErrors.email = 'Required';
                else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email';
                if (!formData.nominatorPhone) newErrors.nominatorPhone = 'Required';
                else if (!validatePhone(formData.nominatorPhone)) newErrors.nominatorPhone = 'Invalid phone';
                break;
            case 2:
                if (!formData.nomineeName) newErrors.nomineeName = 'Required';
                if (!formData.nomineeEmail) newErrors.nomineeEmail = 'Required';
                else if (!validateEmail(formData.nomineeEmail)) newErrors.nomineeEmail = 'Invalid email';
                if (!formData.nomineePhone) newErrors.nomineePhone = 'Required';
                else if (!validatePhone(formData.nomineePhone)) newErrors.nomineePhone = 'Invalid phone';
                break;
            case 3:
                if (!formData.awardCategory) newErrors.awardCategory = 'Required';
                if (!formData.initiativeDescription) newErrors.initiativeDescription = 'Required';
                else if (countWords(formData.initiativeDescription) < DESC_MIN_WORDS) {
                    newErrors.initiativeDescription = `Please write at least ${DESC_MIN_WORDS} words (currently ${countWords(formData.initiativeDescription)}).`;
                }
                if (!formData.supportingEvidence) newErrors.supportingEvidence = 'Required';
                else if (countWords(formData.supportingEvidence) < EVIDENCE_MIN_WORDS) {
                    newErrors.supportingEvidence = `Please write at least ${EVIDENCE_MIN_WORDS} words (currently ${countWords(formData.supportingEvidence)}).`;
                }
                break;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        setAttemptedNext(true);
        if (validateStep(step)) {
            setStep(prev => Math.min(prev + 1, steps));
            scrollToTop();
            setAttemptedNext(false);
        }
    };

    const prevStep = () => {
        setStep(prev => Math.max(prev - 1, 1));
        scrollToTop();
    };

    // Submission with retry & timeout
    const handleSubmit = async (e: FormEvent<HTMLFormElement>, retryCount = 0) => {
        e.preventDefault();
        if (!isReadyToSubmit) {
            setSubmitError('Please complete all required fields before submitting.');
            return;
        }
        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(false);

        try {
            const dataToSend = new FormData();
            Object.entries(formData).forEach(([key, val]) => {
                if (key === 'additionalDocuments') {
                    formData.additionalDocuments.forEach((file) => {
                        dataToSend.append('documents', file, file.name);
                    });
                } else {
                    dataToSend.append(key, val as string);
                }
            });
            // In edit mode, tell the server which already-uploaded documents to keep.
            if (isEditMode) {
                dataToSend.append('keepDocuments', JSON.stringify(existingDocuments));
            }

            const response = await fetch(
                isEditMode ? `/api/nominations/${editId}` : '/api/nominations',
                {
                    method: isEditMode ? 'PUT' : 'POST',
                    body: dataToSend,
                    headers: { Accept: 'application/json' },
                }
            );

            if (!response.ok) {
                if (response.status >= 500 && retryCount < 2) {
                    setTimeout(() => handleSubmit(e, retryCount + 1), 2000);
                    return;
                }
                const errData = await response.json().catch(() => null);
                throw new Error(describeResponseError(response.status, errData));
            }

            if (isEditMode) {
                // Updated successfully; return to the account page.
                trackEvent('Nomination Updated', { category: formData.awardCategory });
                router.push('/account');
                return;
            }

            trackEvent('Nomination Submitted', { category: formData.awardCategory });
            setSubmitSuccess(true);
            localStorage.removeItem(DRAFT_KEY);
            setLastSaved(null);
            setFormData(emptyFormData);
            setStep(1);
        } catch (err: unknown) {
            let msg = 'An unknown error occurred';
            if (err instanceof DOMException && err.name === 'AbortError') {
                msg = 'Request timed out. Please try again.';
            } else if (err instanceof TypeError) {
                msg = 'Network error. Check your connection.';
            } else if (err instanceof Error) {
                msg = err.message;
            }
            setSubmitError(msg);
            trackEvent('Nomination Failed', { category: formData.awardCategory, reason: msg, mode: isEditMode ? 'edit' : 'new' });
            trackError('nomination-submit', err, { category: formData.awardCategory });
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <h3 className="mb-3">Nominator Information</h3>
                        <p className="mb-5 ">Please provide complete details for the nominator. Self-nominations are
                            acceptable; the nominator and nominee may be the same individual or organization.</p>
                        <div className="mb-3">
                            <label htmlFor="nominatorName" className="form-label">Full Name<Required /></label>
                            <input
                                type="text"
                                className={`form-control ${isInvalid('nominatorName') ? 'is-invalid' : ''}`}
                                id="nominatorName"
                                name="nominatorName"
                                autoComplete="name"
                                value={formData.nominatorName}
                                onChange={handleInputChange}
                            />
                            {getFieldError('nominatorName')}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="nominatorOrganization" className="form-label">Organization/Institution<Required /></label>
                            <input
                                type="text"
                                className={`form-control ${isInvalid('nominatorOrganization') ? 'is-invalid' : ''}`}
                                id="nominatorOrganization"
                                name="nominatorOrganization"
                                autoComplete="organization"
                                value={formData.nominatorOrganization}
                                onChange={handleInputChange}
                            />
                            {getFieldError('nominatorOrganization')}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="nominatorPosition" className="form-label">Position/Title<Required /></label>
                            <input
                                type="text"
                                className={`form-control ${isInvalid('nominatorPosition') ? 'is-invalid' : ''}`}
                                id="nominatorPosition"
                                name="nominatorPosition"
                                autoComplete="organization-title"
                                value={formData.nominatorPosition}
                                onChange={handleInputChange}
                            />
                            {getFieldError('nominatorPosition')}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email Address<Required /></label>
                            <input
                                type="email"
                                className={`form-control ${isInvalid('email') ? 'is-invalid' : ''}`}
                                id="email"
                                name="email"
                                autoComplete="email"
                                inputMode="email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                            {getFieldError('email')}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="nominatorPhone" className="form-label">Phone Number<Required /></label>
                            <input
                                type="tel"
                                className={`form-control ${isInvalid('nominatorPhone') ? 'is-invalid' : ''}`}
                                id="nominatorPhone"
                                name="nominatorPhone"
                                autoComplete="tel"
                                inputMode="tel"
                                value={formData.nominatorPhone}
                                onChange={handleInputChange}
                            />
                            {getFieldError('nominatorPhone')}
                        </div>
                    </>
                );
            case 2:
                return (
                    <>
                        <h3 className="mb-3">Nominee Information</h3>
                        <div className="mb-3">
                            <label htmlFor="nomineeName" className="form-label">Full Name (Individual or
                                Organization)<Required /></label>
                            <input
                                type="text"
                                className={`form-control ${isInvalid('nomineeName') ? 'is-invalid' : ''}`}
                                id="nomineeName"
                                name="nomineeName"
                                autoComplete="off"
                                value={formData.nomineeName}
                                onChange={handleInputChange}
                            />
                            {getFieldError('nomineeName')}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="nomineePosition" className="form-label">Position/Title (if
                                applicable)</label>
                            <input
                                type="text"
                                className="form-control"
                                id="nomineePosition"
                                name="nomineePosition"
                                autoComplete="off"
                                value={formData.nomineePosition}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="nomineeOrganization" className="form-label">Organization/Institution (if
                                applicable)</label>
                            <input
                                type="text"
                                className="form-control"
                                id="nomineeOrganization"
                                name="nomineeOrganization"
                                autoComplete="off"
                                value={formData.nomineeOrganization}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="nomineeEmail" className="form-label">Email Address<Required /></label>
                            <input
                                type="email"
                                className={`form-control ${isInvalid('nomineeEmail') ? 'is-invalid' : ''}`}
                                id="nomineeEmail"
                                name="nomineeEmail"
                                autoComplete="off"
                                inputMode="email"
                                value={formData.nomineeEmail}
                                onChange={handleInputChange}
                            />
                            {getFieldError('nomineeEmail')}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="nomineePhone" className="form-label">Phone Number<Required /></label>
                            <input
                                type="tel"
                                className={`form-control ${isInvalid('nomineePhone') ? 'is-invalid' : ''}`}
                                id="nomineePhone"
                                name="nomineePhone"
                                autoComplete="off"
                                inputMode="tel"
                                value={formData.nomineePhone}
                                onChange={handleInputChange}
                            />
                            {getFieldError('nomineePhone')}
                        </div>
                    </>
                );
            case 3:
                return (
                    <>
                        <h3 className="mb-3">Award Category and Initiative Description</h3>
                        <div className="mb-3">
                            <label htmlFor="awardCategory" className="form-label">Award Category<Required /></label>
                            <select
                                className={`form-select ${isInvalid('awardCategory') ? 'is-invalid' : ''}`}
                                id="awardCategory"
                                name="awardCategory"
                                value={formData.awardCategory}
                                onChange={handleInputChange}
                            >
                                <option value="">Select a category</option>
                                {categories.map((category: AwardCategory) => (
                                    <option key={category.name} value={category.name}>{category.name}</option>
                                ))}
                            </select>
                            {getFieldError('awardCategory')}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="initiativeDescription" className="form-label">Description of the
                                Initiative/Contribution<Required /></label>
                            <div className="form-text mb-1">
                                A concise summary of the nominee&apos;s achievement. Minimum {DESC_MIN_WORDS} words, around {DESC_MAX_WORDS} words is ideal.
                            </div>
                            <textarea
                                className={`form-control ${isInvalid('initiativeDescription') ? 'is-invalid' : ''}`}
                                id="initiativeDescription"
                                name="initiativeDescription"
                                rows={4}
                                value={formData.initiativeDescription}
                                onChange={handleInputChange}
                            ></textarea>
                            <WordCounter count={countWords(formData.initiativeDescription)} min={DESC_MIN_WORDS} max={DESC_MAX_WORDS} />
                            {getFieldError('initiativeDescription')}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="supportingEvidence" className="form-label">Supporting Evidence<Required /></label>
                            <div className="form-text mb-1">
                                Detail the impact, results, and significance of the contribution. Minimum {EVIDENCE_MIN_WORDS} words, up to {EVIDENCE_MAX_WORDS} words.
                            </div>
                            <textarea
                                className={`form-control ${isInvalid('supportingEvidence') ? 'is-invalid' : ''}`}
                                id="supportingEvidence"
                                name="supportingEvidence"
                                rows={8}
                                value={formData.supportingEvidence}
                                onChange={handleInputChange}
                            ></textarea>
                            <WordCounter count={countWords(formData.supportingEvidence)} min={EVIDENCE_MIN_WORDS} max={EVIDENCE_MAX_WORDS} />
                            {getFieldError('supportingEvidence')}
                        </div>
                    </>
                );
            case 4:
                return (
                    <>
                        <h3 className="mb-3">Supporting Independent Reference (Optional)</h3>
                        <div className="mb-3">
                            <label htmlFor="referenceName" className="form-label">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="referenceName"
                                name="referenceName"
                                autoComplete="off"
                                value={formData.referenceName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="referencePosition" className="form-label">Position/Title (if
                                applicable)</label>
                            <input
                                type="text"
                                className="form-control"
                                id="referencePosition"
                                name="referencePosition"
                                autoComplete="off"
                                value={formData.referencePosition}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="referenceOrganization" className="form-label">Organization/Institution (if
                                applicable)</label>
                            <input
                                type="text"
                                className="form-control"
                                id="referenceOrganization"
                                name="referenceOrganization"
                                autoComplete="off"
                                value={formData.referenceOrganization}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="referenceEmail" className="form-label">Email Address</label>
                            <input
                                type="email"
                                className={`form-control ${isInvalid('referenceEmail') ? 'is-invalid' : ''}`}
                                id="referenceEmail"
                                name="referenceEmail"
                                autoComplete="off"
                                inputMode="email"
                                value={formData.referenceEmail}
                                onChange={handleInputChange}
                            />
                            {getFieldError('referenceEmail')}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="referencePhone" className="form-label">Phone Number</label>
                            <input
                                type="tel"
                                className={`form-control ${isInvalid('referencePhone') ? 'is-invalid' : ''}`}
                                id="referencePhone"
                                name="referencePhone"
                                autoComplete="off"
                                inputMode="tel"
                                value={formData.referencePhone}
                                onChange={handleInputChange}
                            />
                            {getFieldError('referencePhone')}
                        </div>
                    </>
                );
            case 5:
                return (
                    <>
                        <h3 className="mb-3">Additional Documentation (Optional)</h3>
                        <div className="mb-3">
                            <label htmlFor="additionalDocuments" className="form-label">Upload additional
                                documents</label>
                            <input
                                type="file"
                                className="form-control"
                                id="additionalDocuments"
                                name="additionalDocuments"
                                onChange={handleFileChange}
                                multiple
                                ref={fileInputRef}
                            />
                            <div className="form-text">
                                Accepted formats: PDF, DOC, DOCX, JPG, PNG. Maximum {formatBytes(MAX_FILE_SIZE)} per file
                                and {formatBytes(MAX_TOTAL_UPLOAD_SIZE)} in total. If your documents are larger than this,
                                submit the nomination without them and email them to{' '}
                                <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
                            </div>
                            {totalUploadSize > 0 && (
                                <div className="form-text" aria-live="polite">
                                    Attachments: {formatBytes(totalUploadSize)} of {formatBytes(MAX_TOTAL_UPLOAD_SIZE)} used.
                                </div>
                            )}
                        </div>
                        {existingDocuments.length > 0 && (
                            <div className="mb-3">
                                <h4>Previously Uploaded:</h4>
                                <ul className="list-group">
                                    {existingDocuments.map((doc, index) => (
                                        <li key={doc.url}
                                            className="list-group-item d-flex justify-content-between align-items-center">
                                            <a href={doc.url} target="_blank" rel="noopener noreferrer">{doc.name}</a>
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleExistingDocumentDelete(index)}
                                                aria-label={`Remove ${doc.name}`}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {formData.additionalDocuments.length > 0 && (
                            <div className="mb-3">
                                <h4>Selected Files:</h4>
                                <ul className="list-group">
                                    {formData.additionalDocuments.map((file, index) => (
                                        <li key={index}
                                            className="list-group-item d-flex justify-content-between align-items-center">
                                            <span>{file.name} <span className="text-muted small">({formatBytes(file.size)})</span></span>
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleFileDelete(index)}
                                                aria-label={`Remove ${file.name}`}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="col-md-12">
            <div className="mb-5 text-center">
                <div className="card p-5">
                    {isEditMode ? (
                        <>
                            <h3 className="display-4">Edit Your Nomination</h3>
                            <p>
                                Update the details of your nomination below. Your changes will replace the
                                previously submitted information once you save.
                            </p>
                            <b>
                                For a comprehensive description of all award categories, please <Link href="/awards/categories">click here</Link>.
                            </b>
                        </>
                    ) : (
                        <>
                            <h3 className="display-4">Submit Nomination</h3>
                            <p>
                                We invite electoral practitioners, academics, researchers, and innovators from across the global
                                electoral community to submit nominations for the International Electoral Awards. These
                                accolades celebrate excellence and innovation in electoral practices worldwide.
                            </p>
                            <b>
                                For a comprehensive description of all award categories, please <Link href="/awards/categories">click
                                here</Link>.
                            </b>
                            <p>
                                If you prefer to complete the application offline, you can download the <Link href="/files/submission-form.docx" target="_blank">Word version of the application form</Link>.
                            </p>
                        </>
                    )}
                </div>
            </div>
            <div className="card p-5" ref={cardRef}>
                {editLoading ? (
                    <div className="text-center text-muted py-5">
                        <div className="spinner-border text-primary mb-3" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <div>Loading your nomination...</div>
                    </div>
                ) : editLoadError ? (
                    <div className="alert alert-danger" role="alert">
                        {editLoadError} <Link href="/account">Return to your account</Link>.
                    </div>
                ) : submitSuccess ? (
                    <div className="alert alert-success" role="alert">
                        Thank you for your submission! We have received your application.
                    </div>
                ) : (
                    <>
                        {pendingDraft && (
                            <div className="alert alert-info d-flex flex-column flex-sm-row align-items-sm-center justify-content-between" role="alert">
                                <span>
                                    <i className="bi bi-clock-history me-2"></i>
                                    We found a saved draft of your nomination. Would you like to pick up where you left off?
                                </span>
                                <span className="mt-2 mt-sm-0 flex-shrink-0">
                                    <button type="button" className="btn btn-primary btn-sm me-2" onClick={restoreDraft}>Restore draft</button>
                                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={discardDraft}>Start fresh</button>
                                </span>
                            </div>
                        )}

                        {/* Step progress indicator */}
                        <div className="mb-4">
                            <div className="d-flex justify-content-between mb-2 flex-wrap gap-1">
                                {stepTitles.map((title, idx) => {
                                    const stepNum = idx + 1;
                                    const active = stepNum === step;
                                    const done = stepNum < step;
                                    return (
                                        <span
                                            key={title}
                                            className={`small fw-${active ? 'bold' : 'normal'} ${active ? 'text-primary' : done ? 'text-success' : 'text-muted'}`}
                                        >
                                            {done && <i className="bi bi-check-circle-fill me-1"></i>}
                                            {stepNum}. {title}
                                        </span>
                                    );
                                })}
                            </div>
                            <div className="progress" style={{ height: '6px' }} role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={steps} aria-label="Form progress">
                                <div className="progress-bar" style={{ width: `${(step / steps) * 100}%` }}></div>
                            </div>
                        </div>

                        <form onSubmit={e => handleSubmit(e)}>
                            {renderStep()}
                            {errors.fileUpload && <ErrorAlert errors={errors.fileUpload.split('\n')} />}
                            {submitError && <ErrorAlert errors={submitError} />}

                            <div className="d-flex justify-content-between align-items-center mt-2 small text-secondary">
                                <span>Section {step} of {steps}</span>
                                {lastSaved && (
                                    <span className="text-muted">
                                        <i className="bi bi-cloud-check me-1"></i>
                                        Draft saved at {lastSaved.toLocaleTimeString()}
                                    </span>
                                )}
                            </div>

                            {!isReadyToSubmit && attemptedNext && getStepValidationSummary(step).length > 0 && (
                                <div className="text-danger mt-2">
                                    <small>Missing required fields: {getStepValidationSummary(step).join(', ')}</small>
                                </div>
                            )}
                            <div className="mt-4">
                                {step > 1 && <button type="button" className="btn btn-secondary me-2" onClick={prevStep} disabled={isSubmitting}>Previous</button>}
                                {step < steps ? (
                                    <button type="button" className="btn btn-primary" onClick={nextStep} disabled={isSubmitting}>Next</button>
                                ) : (
                                    <button type="submit" className="btn btn-success" disabled={isSubmitting || !isReadyToSubmit}>
                                        {isEditMode
                                            ? (isSubmitting ? 'Updating...' : 'Update Nomination')
                                            : (isSubmitting ? 'Submitting...' : 'Submit Application')}
                                    </button>
                                )}
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ApplicationForm;
