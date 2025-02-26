// components/admin/UpdateUserModal.tsx
import React, {FC, useState} from 'react';
import Modal from 'components/reuseable/modal/Modal';
import ReusableForm, {InputItem} from 'components/reuseable/Form';
import {MutableUserData} from 'backend/models/user';
import {useAuth} from 'auth/useAuth';

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

    const inputItems = (): InputItem[] => {
        return [
            {
                title: 'First Name',
                placeholder: 'Enter first name',
                type: 'input',
                name: 'firstname',
                defaultValue: userData.firstname,
                required: true
            },
            {
                title: 'Last Name',
                placeholder: 'Enter last name',
                type: 'input',
                name: 'lastname',
                defaultValue: userData.lastname,
                required: true
            },
            {
                title: 'Email',
                placeholder: 'Enter email',
                type: 'email',
                name: 'email',
                defaultValue: userData.email,
                required: true
            },
            {
                title: 'Phone',
                placeholder: 'Enter phone',
                type: 'phone',
                name: 'phone',
                defaultValue: userData.phone,
                required: true
            },
            {
                title: 'Country',
                placeholder: 'Enter country',
                type: 'country',
                name: 'country',
                defaultValue: userData.country,
                required: true
            },
            {
                title: 'Biography',
                placeholder: 'Enter biography',
                type: 'area',
                name: 'biography',
                defaultValue: userData.biography,
                required: false
            },
            {
                title: 'Position',
                placeholder: 'Enter position',
                type: 'input',
                name: 'position',
                defaultValue: userData.position,
                required: true
            },
            {
                title: 'Organisation',
                placeholder: 'Enter organisation',
                type: 'input',
                name: 'organisation',
                defaultValue: userData.organisation,
                required: true
            },
            {
                title: 'Role',
                placeholder: 'Select role',
                type: 'select',
                name: 'role',
                defaultValue: (userData as any).role || '',
                required: false,
                options: [
                    {label: 'User', value: 'user'},
                    {label: 'Admin', value: 'admin'},
                ]
            }
        ];
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
                        inputItems={inputItems()}
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