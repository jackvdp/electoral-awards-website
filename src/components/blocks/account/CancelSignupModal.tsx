// components/events/CancelSignupModal.tsx
import {FC, useState} from "react";
import Modal from "components/reuseable/modal/Modal";
import {useAuth} from "auth/useAuth";
import {IEvent} from "backend/models/event";
import {deleteBookingAPI} from "backend/use_cases/bookings/api/deleteBooking+SendConfirmation";
import {createMutableUserData} from "backend/models/user";

interface CancelSignupModalProps {
    bookingId: string;
    modalID: string;
    event: IEvent;
    onCancelled: () => void;
}

const CancelSignupModal: FC<CancelSignupModalProps> = ({bookingId, modalID, event, onCancelled}) => {
    const {currentUser} = useAuth();
    const [isCancelling, setIsCancelling] = useState(false);
    const [closeModalProgrammatically, setCloseModalProgrammatically] = useState(false);

    const handleCancelSignup = async () => {
        if (!currentUser) return;
        setIsCancelling(true);
        try {
            // If we have the full user object and event, use the complete use case
            const result = await deleteBookingAPI({
                bookingId,
                user: createMutableUserData(currentUser),
                event
            });

            if (result.success) {
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
                            data-bs-dismiss="modal"
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