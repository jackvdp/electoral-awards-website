import React, {useState, ChangeEvent, FormEvent, useRef, useEffect} from 'react';
import useProgressbar from 'hooks/useProgressbar';
import {AwardCategory, categories} from 'data/award-categories';
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

const ApplicationForm: React.FC = () => {
    const [step, setStep] = useState<number>(1);
    const steps: number = 5;
    const cardRef = useRef<HTMLDivElement>(null);
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
    const [isCurrentStepComplete, setIsCurrentStepComplete] = useState(false);
    const [attemptedNext, setAttemptedNext] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    useProgressbar(submitSuccess ? 100 : progress);

    const scrollToTop = () => {
        if (cardRef.current) {
            cardRef.current.scrollIntoView({behavior: 'smooth'});
        }
    };

    const nextStep = () => {
        if (isCurrentStepComplete) {
            setStep(prev => Math.min(prev + 1, steps));
            scrollToTop();
        }
    };

    const prevStep = () => {
        setStep(prev => Math.max(prev - 1, 1));
        scrollToTop();
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
        setErrors(prevErrors => ({...prevErrors, [name]: ''}));
        if (attemptedNext) {
            validateStep(step);
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files as FileList);
            setFormData(prevData => ({
                ...prevData,
                additionalDocuments: [...prevData.additionalDocuments, ...newFiles]
            }));
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleFileDelete = (index: number) => {
        setFormData(prevData => ({
            ...prevData,
            additionalDocuments: prevData.additionalDocuments.filter((_, i) => i !== index)
        }));

        // Clear the file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);

    const isNonEmptyString = (value: string | null): boolean => {
        return typeof value === 'string' && value.trim().length > 0;
    };

    // Add this useEffect hook to check form completeness
    useEffect(() => {
        const isFormComplete: boolean =
            isNonEmptyString(formData.nominatorName) &&
            isNonEmptyString(formData.nominatorOrganization) &&
            isNonEmptyString(formData.nominatorPosition) &&
            isNonEmptyString(formData.email) &&
            isNonEmptyString(formData.nominatorPhone) &&
            isNonEmptyString(formData.nomineeName) &&
            isNonEmptyString(formData.nomineeEmail) &&
            isNonEmptyString(formData.nomineePhone) &&
            isNonEmptyString(formData.awardCategory) &&
            isNonEmptyString(formData.initiativeDescription) &&
            isNonEmptyString(formData.supportingEvidence);

        setIsReadyToSubmit(isFormComplete && step === steps);
    }, [formData, step, steps]);

    useEffect(() => {
        const newProgress = ((step - 1) / (steps)) * 100;
        setProgress(newProgress);
    }, [step, steps]);

    useEffect(() => {
        setIsCurrentStepComplete(isStepComplete(step));
    }, [formData, step]);

    const validateEmail = (email: string): boolean => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(email);
    };

    const validatePhone = (phone: string): boolean => {
        const re = /^\+?[1-9]\d{1,14}$/;
        return re.test(phone);
    };

    const isStepComplete = (currentStep: number): boolean => {
        switch (currentStep) {
            case 1:
                return !!formData.nominatorName && !!formData.nominatorOrganization &&
                    !!formData.nominatorPosition && !!formData.email &&
                    !!formData.nominatorPhone;
            case 2:
                return !!formData.nomineeName && !!formData.nomineeEmail &&
                    !!formData.nomineePhone;
            case 3:
                return !!formData.awardCategory && !!formData.initiativeDescription &&
                    !!formData.supportingEvidence;
            case 4:
            case 5:
                return true; // These steps are optional
            default:
                return false;
        }
    };

    const validateStep = (currentStep: number): boolean => {
        const newErrors: { [key: string]: string } = {};

        switch (currentStep) {
            case 1:
                if (!formData.nominatorName) newErrors.nominatorName = "Nominator name is required";
                if (!formData.nominatorOrganization) newErrors.nominatorOrganization = "Organization is required";
                if (!formData.nominatorPosition) newErrors.nominatorPosition = "Position is required";
                if (!formData.email) newErrors.email = "Email is required";
                else if (!validateEmail(formData.email)) newErrors.email = "Invalid email format";
                if (!formData.nominatorPhone) newErrors.nominatorPhone = "Phone number is required";
                else if (!validatePhone(formData.nominatorPhone)) newErrors.nominatorPhone = "Invalid phone number format";
                break;
            case 2:
                if (!formData.nomineeName) newErrors.nomineeName = "Nominee name is required";
                if (!formData.nomineeEmail) newErrors.nomineeEmail = "Email is required";
                else if (!validateEmail(formData.nomineeEmail)) newErrors.nomineeEmail = "Invalid email format";
                if (!formData.nomineePhone) newErrors.nomineePhone = "Phone number is required";
                else if (!validatePhone(formData.nomineePhone)) newErrors.nomineePhone = "Invalid phone number format";
                break;
            case 3:
                if (!formData.awardCategory) newErrors.awardCategory = "Award category is required";
                if (!formData.initiativeDescription) newErrors.initiativeDescription = "Initiative description is required";
                if (!formData.supportingEvidence) newErrors.supportingEvidence = "Supporting evidence is required";
                break;
            // Cases 4 and 5 are optional, so no validation needed
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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
                                className="form-control"
                                id="nominatorName"
                                name="nominatorName"
                                value={formData.nominatorName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="nominatorOrganization"
                                   className="form-label">Organization/Institution</label>
                            <input
                                type="text"
                                className="form-control"
                                id="nominatorOrganization"
                                name="nominatorOrganization"
                                value={formData.nominatorOrganization}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="nominatorPosition" className="form-label">Position/Title</label>
                            <input
                                type="text"
                                className="form-control"
                                id="nominatorPosition"
                                name="nominatorPosition"
                                value={formData.nominatorPosition}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="nominatorPhone" className="form-label">Phone Number</label>
                            <input
                                type="tel"
                                className="form-control"
                                id="nominatorPhone"
                                name="nominatorPhone"
                                value={formData.nominatorPhone}
                                onChange={handleInputChange}
                                required
                            />
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
                                maxLength={200}
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
                                maxLength={1000}
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

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isReadyToSubmit) {
            setSubmitError('Please fill out all required fields before submitting.');
            return;
        }
        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(false);

        try {
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'additionalDocuments') {
                    value.forEach((file: File, index: number) => {
                        formDataToSend.append(`additionalDocument_${index}`, file, file.name);
                    });
                } else if (typeof value === 'string') {
                    formDataToSend.append(key, value);
                }
            });

            const response = await fetch(
                "https://formspree.io/f/mqazqnnd",
                {
                    method: "POST",
                    body: formDataToSend,
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            );

            const data = await response.json();

            if (response.ok) {
                setSubmitSuccess(true);
                // Reset form data...
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
            } else {
                if (data.errors) {
                    const errorMessages = data.errors.map((error: any) => `${error.field} - ${error.message}`).join(', ');
                    console.log('Validation errors:', errorMessages);
                    throw new Error(`Validation errors: ${errorMessages}`);
                } else {
                    throw new Error('Form submission failed');
                }
            }
        } catch (error: unknown) {
            let errorMessage = 'An unknown error occurred';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            setSubmitError(`There was an error submitting the form: ${errorMessage}`);
            console.error('Form submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='col-md-12'>
            <div className="mb-5 pb-6 pb-md-12 text-center">
                <div className="card p-md-10 p-5">
                    <h3 className='display-4'>Submit Nomination</h3>
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
            <div className="card p-md-10 p-5" ref={cardRef}>
                <div className="col-md-6">
                    <ul className="progress-list">
                        <li>
                            <p>{submitSuccess ? "" : `Section ${step} out of ${steps}`}</p>
                            <div
                                className="progressbar line blue"
                                data-value={submitSuccess ? "100" : progress.toString()}
                            />
                        </li>
                    </ul>
                </div>
                {submitSuccess ? (
                    <div className="alert alert-success" role="alert">
                        Thank you for your submission! We have received your application.
                    </div>
                ) : (
                    <form className="mt-3" onSubmit={handleSubmit}>
                        {renderStep()}
                        {submitError && (
                            <div className="alert alert-danger" role="alert">
                                {submitError}
                            </div>
                        )}
                        <div className="mt-10">
                            {step > 1 && (
                                <button type="button" className="btn btn-secondary me-2" onClick={prevStep}
                                        disabled={isSubmitting}>
                                    Previous
                                </button>
                            )}
                            {step < steps ? (
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={nextStep}
                                    disabled={isSubmitting || !isCurrentStepComplete}
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="btn btn-success"
                                    disabled={isSubmitting || !isReadyToSubmit}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                                </button>
                            )}
                            {
                                <p className="text-secondary mt-2">{isCurrentStepComplete ? "" : "*Please fill out all required fields"}</p>}
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ApplicationForm;