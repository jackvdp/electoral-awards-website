// components/admin/UpdateUserModal.tsx
import React, {FC, useState} from 'react';
import Modal from 'components/reuseable/modal/Modal';
import ReusableForm, {InputItem} from 'components/reuseable/Form';
import {MutableUserData} from 'backend/models/user';
import {useAuth} from 'auth/useAuth';
import inputItems from "../reusables/userInputItems";

interface UpdateUserModalProps {
    modalID: string;
    userData: MutableUserData;
    onUpdated: (updatedUser: MutableUserData) => void;
}

const UpdateUserModal: FC<UpdateUserModalProps> = ({modalID, userData, onUpdated}) => {
    const {updateUser} = useAuth();
    const [isUpdating, setIsUpdating] = useState(false);
    const [closeModalProgrammatically, setCloseModalProgrammatically] = useState(false);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    const handleFormSubmit = async (values: Record<string, string>) => {
        setAlertMessage(null);
        setIsUpdating(true);
        // Build updated user data.
        const updatedUser: MutableUserData = {
            ...userData,
            firstname: values.firstname || userData.firstname,
            lastname: values.lastname || userData.lastname,
            email: values.email || userData.email,
            phone: values.phone || userData.phone,
            country: values.country || userData.country,
            birthdate: values.birthdate || userData.birthdate,
            biography: values.biography || userData.biography,
            position: values.position || userData.position,
            organisation: values.organisation || userData.organisation,
            profileImage: values.profileImage || userData.profileImage,
            role: values.role || userData.role,
        };

        const updated = await updateUser(updatedUser, userData.id);
        setIsUpdating(false);
        if (updated) {
            setAlertMessage('User updated successfully.');
            setCloseModalProgrammatically(true);
            onUpdated(updated);
        } else {
            setAlertMessage('Failed to update user.');
        }
    };

    return (
        <Modal
            id={modalID}
            size={'xl'}
            programmaticClose={{
                closeTriggered: closeModalProgrammatically,
                resetAfterClose: () => setCloseModalProgrammatically(false),
            }}
            content={
                <>
                    <h4 className="mb-3">Update User</h4>
                    {alertMessage && <p className="text-info">{alertMessage}</p>}
                    <ReusableForm
                        inputItems={inputItems(userData)}
                        submitButtonTitle={isUpdating ? 'Updating...' : 'Update User'}
                        onSubmit={handleFormSubmit}
                        disableSubmitInitially={false}
                    />
                </>
            }
        />
    );
};

export default UpdateUserModal;