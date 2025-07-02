import React, { useState, ChangeEvent, FormEvent, useRef, useEffect } from 'react';
import useProgressbar from 'hooks/useProgressbar';
import { AwardCategory, categories } from 'data/award-categories';
import Link from 'next/link';
import 'bootstrap-icons/font/bootstrap-icons.css';

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

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png'
];

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

const ApplicationForm: React.FC = () => {
    const [step, setStep] = useState<number>(1);
    const steps = 5;
    const cardRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);


    const [formData, setFormData] = useState<FormData>({
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
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [attemptedNext, setAttemptedNext] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);

    useProgressbar(submitSuccess ? 100 : progress);

    // Show specific field errors
    const getFieldError = (fieldName: string) => {
        return errors[fieldName] && attemptedNext ? (
            <div className="invalid-feedback d-block">
                {errors[fieldName]}
            </div>
        ) : null;
    };

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
            isNonEmptyString(formData.initiativeDescription) &&
            isNonEmptyString(formData.supportingEvidence);
        setIsReadyToSubmit(complete && step === steps);
    }, [formData, step]);

    // Update progress bar
    useEffect(() => {
        setProgress(((step - 1) / steps) * 100);
    }, [step]);

    useEffect(() => {
        const timer = setTimeout(() => {
            localStorage.setItem(
                'awardFormDraft',
                JSON.stringify({ formData, currentStep: step, savedAt: new Date().toISOString() })
            );
            setLastSaved(new Date());
        }, 1000);
        return () => clearTimeout(timer);
    }, [formData, step]);

    // Load draft on mount
    useEffect(() => {
        const draft = localStorage.getItem('awardFormDraft');
        if (!draft) return;             // nothing to restore

        try {
            const { formData: savedData, currentStep, savedAt } = JSON.parse(draft);
            // check that at least one field has non-empty content
            const hasData = Object.entries(savedData).some(([k, v]) =>
                k === 'additionalDocuments'
                    ? Array.isArray(v) && v.length > 0
                    : typeof v === 'string' && v.trim() !== ''
            );
            const ageHrs = (Date.now() - new Date(savedAt).getTime()) / (1000 * 60 * 60);

            if (hasData && ageHrs < 24 && window.confirm('Restore your previous draft?')) {
                setFormData({ ...savedData, additionalDocuments: [] });
                setStep(currentStep);
            }
        } catch {
            console.error('Error loading draft');
        }
    }, []);


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

    // File upload with size/type checks
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            const newFiles = Array.from(e.target.files);
            const valid: File[] = [];
            const fileErrors: string[] = [];

            newFiles.forEach(file => {
                if (!ALLOWED_FILE_TYPES.includes(file.type)) {
                    fileErrors.push(`${file.name}: Invalid file type. Allowed: PDF, DOC, DOCX, JPG, PNG`);
                } else if (file.size > MAX_FILE_SIZE) {
                    fileErrors.push(`${file.name}: File too large. Max size: 10MB`);
                } else {
                    valid.push(file);
                }
            });

            if (fileErrors.length) {
                setErrors(prev => ({ ...prev, fileUpload: fileErrors.join('\n') }));
            } else {
                setErrors(prev => ({ ...prev, fileUpload: '' }));
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
        if (fileInputRef.current) fileInputRef.current.value = '';
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
            if (!formData.initiativeDescription) missing.push('Initiative description');
            if (!formData.supportingEvidence) missing.push('Supporting evidence');
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
                if (!formData.supportingEvidence) newErrors.supportingEvidence = 'Required';
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
                    formData.additionalDocuments.forEach((file, i) => {
                        dataToSend.append(`document_${i}`, file, file.name);
                    });
                } else {
                    dataToSend.append(key, val as string);
                }
            });

            const response = await fetch('https://formspree.io/f/mqazqnnd', {
                method: 'POST',
                body: dataToSend,
                headers: { Accept: 'application/json' },
            });

            if (!response.ok) {
                if (response.status >= 500 && retryCount < 2) {
                    setTimeout(() => handleSubmit(e, retryCount + 1), 2000);
                    return;
                }
                const errData = await response.json();
                throw new Error(errData.message || `Server error: ${response.status}`);
            }

            setSubmitSuccess(true);
            setFormData({
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
            });
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
                            <label htmlFor="nominatorName" className="form-label">Full Name</label>
                            <input
                                type="text"
                                className={`form-control ${errors.nominatorName && attemptedNext ? 'is-invalid' : ''}`}
                                id="nominatorName"
                                name="nominatorName"
                                value={formData.nominatorName}
                                onChange={handleInputChange}
                            />
                            {getFieldError('nominatorName')}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="nominatorOrganization" className="form-label">Organization/Institution</label>
                            <input
                                type="text"
                                className={`form-control ${errors.nominatorOrganization && attemptedNext ? 'is-invalid' : ''}`}
                                id="nominatorOrganization"
                                name="nominatorOrganization"
                                value={formData.nominatorOrganization}
                                onChange={handleInputChange}
                            />
                            {getFieldError('nominatorOrganization')}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="nominatorPosition" className="form-label">Position/Title</label>
                            <input
                                type="text"
                                className={`form-control ${errors.nominatorPosition && attemptedNext ? 'is-invalid' : ''}`}
                                id="nominatorPosition"
                                name="nominatorPosition"
                                value={formData.nominatorPosition}
                                onChange={handleInputChange}
                            />
                            {getFieldError('nominatorPosition')}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <input
                                type="email"
                                className={`form-control ${errors.email && attemptedNext ? 'is-invalid' : ''}`}
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                            {getFieldError('email')}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="nominatorPhone" className="form-label">Phone Number</label>
                            <input
                                type="tel"
                                className={`form-control ${errors.nominatorPhone && attemptedNext ? 'is-invalid' : ''}`}
                                id="nominatorPhone"
                                name="nominatorPhone"
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
                                Organization)</label>
                            <input
                                type="text"
                                className="form-control"
                                id="nomineeName"
                                name="nomineeName"
                                value={formData.nomineeName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="nomineePosition" className="form-label">Position/Title (if
                                applicable)</label>
                            <input
                                type="text"
                                className="form-control"
                                id="nomineePosition"
                                name="nomineePosition"
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
                                value={formData.nomineeOrganization}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="nomineeEmail" className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-control"
                                id="nomineeEmail"
                                name="nomineeEmail"
                                value={formData.nomineeEmail}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="nomineePhone" className="form-label">Phone Number</label>
                            <input
                                type="tel"
                                className="form-control"
                                id="nomineePhone"
                                name="nomineePhone"
                                value={formData.nomineePhone}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </>
                );
            case 3:
                return (
                    <>
                        <h3 className="mb-3">Award Category and Initiative Description</h3>
                        <div className="mb-3">
                            <label htmlFor="awardCategory" className="form-label">Award Category</label>
                            <select
                                className="form-select"
                                id="awardCategory"
                                name="awardCategory"
                                value={formData.awardCategory}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select a category</option>
                                {categories.map((category: AwardCategory) => (
                                    <option key={category.name} value={category.name}>{category.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="initiativeDescription" className="form-label">Description of the
                                Initiative/Contribution (max 200 words)</label>
                            <textarea
                                className="form-control"
                                id="initiativeDescription"
                                name="initiativeDescription"
                                rows={3}
                                value={formData.initiativeDescription}
                                onChange={handleInputChange}
                                required
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="supportingEvidence" className="form-label">Supporting Evidence (max 1000
                                words)</label>
                            <textarea
                                className="form-control"
                                id="supportingEvidence"
                                name="supportingEvidence"
                                rows={6}
                                value={formData.supportingEvidence}
                                onChange={handleInputChange}
                                required
                            ></textarea>
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
                                value={formData.referenceOrganization}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="referenceEmail" className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-control"
                                id="referenceEmail"
                                name="referenceEmail"
                                value={formData.referenceEmail}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="referencePhone" className="form-label">Phone Number</label>
                            <input
                                type="tel"
                                className="form-control"
                                id="referencePhone"
                                name="referencePhone"
                                value={formData.referencePhone}
                                onChange={handleInputChange}
                            />
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
                        </div>
                        {formData.additionalDocuments.length > 0 && (
                            <div className="mb-3">
                                <h4>Selected Files:</h4>
                                <ul className="list-group">
                                    {formData.additionalDocuments.map((file, index) => (
                                        <li key={index}
                                            className="list-group-item d-flex justify-content-between align-items-center">
                                            {file.name}
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleFileDelete(index)}
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

                </div>
            </div>
            <div className="card p-5" ref={cardRef}>
                {submitSuccess ? (
                    <div className="alert alert-success" role="alert">
                        Thank you for your submission! We have received your application.
                    </div>
                ) : (
                    <form onSubmit={e => handleSubmit(e)}>
                        {renderStep()}
                        {errors.fileUpload && <ErrorAlert errors={errors.fileUpload} />}
                        {submitError && <ErrorAlert errors={submitError} />}
                        {lastSaved && (
                            <div className="text-muted small mb-2">
                                Last saved at {lastSaved.toLocaleTimeString()}
                            </div>
                        )}

                        {!isNonEmptyString(submitSuccess.toString()) && (
                            <div className="text-secondary mt-2">Section {step} of {steps}</div>
                        )}
                        {!isReadyToSubmit && attemptedNext && (
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
                                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                                </button>
                            )}
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ApplicationForm;
