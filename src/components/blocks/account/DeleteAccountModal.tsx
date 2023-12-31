import { FC, useState, useRef } from "react";
import Modal from "components/reuseable/modal/modal";
import { useAuth } from "auth/AuthProvider";

interface DeletePressedProps {
    modalID: string;
}

const DeleteAccountModal: FC<DeletePressedProps> = ({ modalID }) => {
    // const { deleteAccount } = useAuth();
    const [isDeleting, setIsDeleting] = useState(false);
    const modalRef = useRef(null);
    const [closeModalProgrammatically, setCloseModalProgrammatically] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        // await deleteAccount();
        setIsDeleting(false);
        setCloseModalProgrammatically(true);
    };

    return (
        <Modal
            id={modalID}
            programmaticClose={{ 
                closeTriggered: closeModalProgrammatically, 
                resetAfterClose: () => setCloseModalProgrammatically(false)
            }}
            content={<>
                <h4 className="mb-3">Are you sure you want to delete your account?</h4>
                <p className="mb-4">This action cannot be undone.</p>
                <div className="d-grid gap-2">
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    >
                        Cancel
                    </button>
                </div>
            </>}
        />
    );
};

export default DeleteAccountModal;
