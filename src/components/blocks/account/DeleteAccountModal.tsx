import {FC, useState} from "react";
import Modal from "components/reuseable/modal/Modal";
import {useAuth} from "auth/useAuth";
import {MutableUserData} from "backend/models/user";
import Router from "next/router";
import {createClient} from "backend/supabase/component";

interface DeletePressedProps {
    modalID: string;
    userData: MutableUserData;
}

const DeleteAccountModal: FC<DeletePressedProps> = ({modalID, userData}) => {
    const {deleteUser} = useAuth();
    const [isDeleting, setIsDeleting] = useState(false);
    const [closeModalProgrammatically, setCloseModalProgrammatically] = useState(false);
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleDelete = async () => {
        setErrorMessage(null);
        if (!password) {
            setErrorMessage("Please enter your password");
            return;
        }
        setIsDeleting(true);
        try {
            const successfullyDeleted = await deleteUser(userData.id, password);
            if (successfullyDeleted) {
                setCloseModalProgrammatically(true);
                Router.push("/");
            }
        } catch (error: any) {
            setErrorMessage(error.message || "Failed to delete account. Please try again later.");
        }
        setIsDeleting(false);
    };

    return (
        <Modal
            id={modalID}
            programmaticClose={{
                closeTriggered: closeModalProgrammatically,
                resetAfterClose: () => setCloseModalProgrammatically(false),
            }}
            content={
                <>
                    <h4 className="mb-3">Are you sure you want to delete your account?</h4>
                    <p className="mb-4">
                        This action cannot be undone. Please enter your password to confirm.
                    </p>
                    <div className="mb-3">
                        <label htmlFor="deletePassword" className="form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            id="deletePassword"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errorMessage && <small className="text-danger">{errorMessage}</small>}
                    </div>
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
                </>
            }
        />
    );
};

export default DeleteAccountModal;