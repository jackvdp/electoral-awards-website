// components/events/CancelSignupModal.tsx
import {FC, useState} from "react";
import Modal from "components/reuseable/modal/Modal";
import {useAuth} from "auth/useAuth";

interface CancelSignupModalProps {
    modalID: string;
    eventId: string;
    onCancelled: () => void;
}

const CancelSignupModal: FC<CancelSignupModalProps> = ({modalID, eventId, onCancelled}) => {
    const {currentUser} = useAuth();
    const [isCancelling, setIsCancelling] = useState(false);
    const [closeModalProgrammatically, setCloseModalProgrammatically] = useState(false);

    const handleCancelSignup = async () => {
        if (!currentUser) return;
        setIsCancelling(true);
        try {
            const res = await fetch('/api/events/cancelSignup', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({eventId, userId: currentUser.id})
            });
            if (res.ok) {
                setCloseModalProgrammatically(true);
                onCancelled(); // remove the event from the list
            } else {
                alert("Failed to cancel sign up. Please try again later.");
            }
        } catch (error) {
            alert("Failed to cancel sign up. Please try again later.");
        } finally {
            setIsCancelling(false);
        }
    };

    return (
        <Modal
            id={modalID}
            programmaticClose={{
                closeTriggered: closeModalProgrammatically,
                resetAfterClose: () => setCloseModalProgrammatically(false)
            }}
            content={
                <>
                    <h4 className="mb-3">Are you sure you want to cancel your sign up?</h4>
                    <p className="mb-4">This action will remove you from the event’s sign ups.</p>
                    <div className="d-grid gap-2">
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={handleCancelSignup}
                            disabled={isCancelling}
                        >
                            {isCancelling ? "Cancelling..." : "Cancel Sign Up"}
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        >
                            Close
                        </button>
                    </div>
                </>
            }
        />
    );
};

export default CancelSignupModal;