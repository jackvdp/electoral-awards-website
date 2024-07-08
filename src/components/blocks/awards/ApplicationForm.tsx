import React, { useState, ChangeEvent, FormEvent, useRef } from 'react';
import useProgressbar from 'hooks/useProgressbar';
import { AwardCategory, categories } from 'data/award-categories';

interface FormData {
  nominatorName: string;
  nominatorOrganization: string;
  nominatorPosition: string;
  nominatorEmail: string;
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
  additionalDocuments: File | null;
}

const ApplicationForm: React.FC = () => {
  useProgressbar();
  const [step, setStep] = useState<number>(1);
  const steps = 5;
  const cardRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<FormData>({
    nominatorName: '',
    nominatorOrganization: '',
    nominatorPosition: '',
    nominatorEmail: '',
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
    additionalDocuments: null,
  });

  const scrollToTop = () => {
    if (cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const nextStep = () => {
    setStep(prev => Math.min(prev + 1, steps));
    scrollToTop();
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
    scrollToTop();
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, additionalDocuments: e.target.files[0] });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h3 className="mb-3">Nominator Information</h3>
            <p className="mb-5 ">Please provide complete details for the nominator. Self-nominations are acceptable; the nominator and nominee may be the same individual or organization.</p>
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
              <label htmlFor="nominatorOrganization" className="form-label">Organization/Institution</label>
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
              <label htmlFor="nominatorEmail" className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                id="nominatorEmail"
                name="nominatorEmail"
                value={formData.nominatorEmail}
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
              <label htmlFor="nomineeName" className="form-label">Full Name (Individual or Organization)</label>
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
              <label htmlFor="nomineePosition" className="form-label">Position/Title (if applicable)</label>
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
              <label htmlFor="nomineeOrganization" className="form-label">Organization/Institution (if applicable)</label>
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
              <label htmlFor="initiativeDescription" className="form-label">Description of the Initiative/Contribution (max 200 words)</label>
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
              <label htmlFor="supportingEvidence" className="form-label">Supporting Evidence (max 1000 words)</label>
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
              <label htmlFor="referencePosition" className="form-label">Position/Title (if applicable)</label>
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
              <label htmlFor="referenceOrganization" className="form-label">Organization/Institution (if applicable)</label>
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
              <label htmlFor="additionalDocuments" className="form-label">Upload additional documents</label>
              <input
                type="file"
                className="form-control"
                id="additionalDocuments"
                onChange={handleFileChange}
                multiple
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log(formData);
    // For now, we'll just log the form data
  };

  return (
    <div className='col-md-9'>
      <p className="mb-5 pb-6 pb-md-12 pb-md-8 text-center">
        We invite electoral practitioners, academics, researchers, and innovators from across the global electoral community to submit nominations for the International Electoral Awards. These accolades celebrate excellence and innovation in electoral practices worldwide.<br /> For a comprehensive description of all award categories, please <a href="/awards/categories">click here</a>.
      </p>
      <div className="card p-md-10 p-5" ref={cardRef}>
        <div className="col-md-6">
          <ul className="progress-list">
            <li>
              <p>Section {step} out of {steps}</p>
              <div className="progressbar line blue" data-value={`${(step) / steps * 100}`} />
            </li>
          </ul>
        </div>
        <form className="mt-3" onSubmit={handleSubmit}>
          {renderStep()}
          <div className="mt-10">
            {step > 1 && (
              <button type="button" className="btn btn-secondary me-2" onClick={prevStep}>
                Previous
              </button>
            )}
            {step < 5 ? (
              <button type="button" className="btn btn-primary" onClick={nextStep}>
                Next
              </button>
            ) : (
              <button type="submit" className="btn btn-success">
                Submit Application
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;