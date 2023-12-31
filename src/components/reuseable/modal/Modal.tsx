import { FC } from 'react';
import { useEffect } from 'react';

interface ModalProps {
    id: string;
    programmaticClose?: ProgrammaticClose;
    content: JSX.Element
}

interface ProgrammaticClose {
    closeTriggered: boolean;
    resetAfterClose: () => void;
}

const Modal: FC<ModalProps> = ({ id, content, programmaticClose }) => {

    useEffect(() => {
        if (programmaticClose?.closeTriggered) {
            programmaticClose.resetAfterClose();
            pressCloseButton();
        }
    }, [programmaticClose?.closeTriggered]);

    const pressCloseButton = () => {
        const closeButton = document.getElementById(`close-${id}`);
        if (closeButton) {
            closeButton.click();
        }
    }

    return (
        <div
            role="dialog"
            tabIndex={-1}
            aria-modal="true"
            id={id}
            className="modal fade"
            style={{ display: 'none' }}
        >
            <div className="modal-dialog modal-dialog-centered modal-sm">
                <div className="modal-content text-center">
                    <div className="modal-body">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id={`close-${id}`} />

                        {content}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;