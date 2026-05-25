// components/admin/userModals/DeleteUserModal.tsx
import React, {FC, useState} from 'react';
import Modal from 'components/reuseable/modal/Modal';
import {useAuth} from 'auth/useAuth';
import {MutableUserData} from 'backend/models/user';

interface DeleteUserModalProps {
    modalID: string;
    userData: MutableUserData;
    onDeleted?: () => void;
}

const DeleteUserModal: FC<DeleteUserModalProps> = ({modalID, userData, onDeleted}) => {
    const {deleteUserWithoutPassword} = useAuth();
    const [isDeleting, setIsDeleting] = useState(false);
    const [closeModalProgrammatically, setCloseModalProgrammatically] = useState(false);
    const [alertMessage, setAlertMessage] = useState<{
        type: 'error' | 'success' | 'info';
        message: string
    } | null>(null);

    const handleDelete = async () => {
        setAlertMessage(null);
        setIsDeleting(true);

        try {
            await deleteUserWithoutPassword(userData.id);
            setAlertMessage({type: 'success', message: 'User deleted successfully.'});
            setCloseModalProgrammatically(true);

            // Notify parent component
            if (onDeleted) {
                setTimeout(() => {
                    onDeleted();
                }, 500);
            }
        } catch (error: any) {
            setAlertMessage({
                type: 'error',
                message: error.message || 'Failed to delete user. Please try again.'
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const getAlertClass = () => {
        switch (alertMessage?.type) {
            case 'error':
                return 'alert alert-danger';
            case 'success':
                return 'alert alert-success';
            case 'info':
                return 'alert alert-info';
            default:
                return '';
        }
    };

    return (
        <Modal
            id={modalID}
            size="md"
            programmaticClose={{
                closeTriggered: closeModalProgrammatically,
                resetAfterClose: () => {
                    setCloseModalProgrammatically(false);
                    setAlertMessage(null);
                },
            }}
            content={
                <>
                    <div className="modal-header">
                        <h1 className="modal-title">Delete User</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div className="modal-body">
                        {alertMessage && (
                            <div className={getAlertClass()} role="alert">
                                {alertMessage.message}
                            </div>
                        )}

                        <div className="mb-4">
                            <p>Are you sure you want to delete the following user?</p>
                            <div className="border p-3 rounded mb-3 bg-light">
                                <p className="mb-1"><strong>Name:</strong> {userData.firstname} {userData.lastname}</p>
                                <p className="mb-1"><strong>Email:</strong> {userData.email}</p>
                                <p className="mb-0"><strong>Role:</strong> {userData.role || 'user'}</p>
                            </div>
                            <p className="text-danger"><strong>Warning:</strong> This action cannot be undone.</p>
                        </div>

                        <div className="d-flex justify-content-end mt-4">
                            <button
                                type="button"
                                className="btn btn-secondary me-2"
                                data-bs-dismiss="modal"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete User'}
                            </button>
                        </div>
                    </div>
                </>
            }
        />
    );
};

export default DeleteUserModal;