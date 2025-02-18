import {FC, useState} from "react";
import Modal from "components/reuseable/modal/Modal";
import {useAuth} from "auth/useAuth";
import {MutableUserData} from "backend/models/user";
import Router from "next/router";

interface DeletePressedProps {
    modalID: string;
    userData: MutableUserData;
}

const DeleteAccountModal: FC<DeletePressedProps> = ({modalID, userData}) => {
    const {deleteUser} = useAuth();
    const [isDeleting, setIsDeleting] = useState(false);
    const [closeModalProgrammatically, setCloseModalProgrammatically] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        const successfullyDeletedUser = await deleteUser(userData.id);
        setIsDeleting(false);
        if (successfullyDeletedUser) {
            setCloseModalProgrammatically(true);
            Router.push("/");
        } else {
            alert("Failed to delete user. Please try again later.");
        }
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
