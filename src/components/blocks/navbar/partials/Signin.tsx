import { FC, useEffect, useState } from 'react';
import LoginForm from 'components/elements/forms/LoginForm';

const Signin: FC = () => {
  const [heading, setHeading] = useState<string | undefined>();
  const [description, setDescription] = useState<string | undefined>();
  const [signupUrl, setSignupUrl] = useState<string | undefined>();

  useEffect(() => {
    const modal = document.getElementById('modal-signin');
    if (!modal) return;

    const onShow = () => {
      setHeading(modal.dataset.heading || undefined);
      setDescription(modal.dataset.description || undefined);
      setSignupUrl(modal.dataset.signupUrl || undefined);
    };

    const onHidden = () => {
      delete modal.dataset.heading;
      delete modal.dataset.description;
      delete modal.dataset.signupUrl;
      setHeading(undefined);
      setDescription(undefined);
      setSignupUrl(undefined);
    };

    modal.addEventListener('show.bs.modal', onShow);
    modal.addEventListener('hidden.bs.modal', onHidden);
    return () => {
      modal.removeEventListener('show.bs.modal', onShow);
      modal.removeEventListener('hidden.bs.modal', onHidden);
    };
  }, []);

  return (
    <div
      role="dialog"
      tabIndex={-1}
      aria-modal="true"
      id="modal-signin"
      className="modal fade"
      style={{ display: 'none' }}
    >
      <div className="modal-dialog modal-dialog-centered modal-sm">
        <div className="modal-content text-center">
          <div className="modal-body">
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />

            <LoginForm heading={heading} description={description} signupUrl={signupUrl} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
