// components/admin/CreateUserModal.tsx
import React, {FC, useState} from 'react';
import Modal from 'components/reuseable/modal/Modal';
import ReusableForm, {InputItem} from 'components/reuseable/Form';
import {CreateUserData} from 'backend/models/user';
import {useAuth} from 'auth/useAuth';

interface CreateUserModalProps {
    modalID: string;
}

const CreateUserModal: FC<CreateUserModalProps> = ({modalID}) => {
    const {createUser} = useAuth();
    const [isCreating, setIsCreating] = useState(false);
    const [closeModalProgrammatically, setCloseModalProgrammatically] = useState(false);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    // Build a CreateUserData object from form values.
    const buildUserData = (values: Record<string, string>): CreateUserData => ({
        firstname: values.firstname,
        lastname: values.lastname,
        email: values.email,
        password: values.password, // required for creation
        phone: values.phone,
        country: values.country,
        birthdate: values.birthdate || "",
        biography: values.biography || "",
        position: values.position,
        organisation: values.organisation,
        profileImage: values.profileImage || "",
        role: values.role || "", // if empty, treat as regular user
    });

    const handleFormSubmit = async (values: Record<string, string>) => {
        setAlertMessage(null);
        setIsCreating(true);
        const userData = buildUserData(values);
        const success = await createUser(userData);
        setIsCreating(false);
        if (success) {
            setAlertMessage('User created successfully.');
            setCloseModalProgrammatically(true);
        } else {
            setAlertMessage('Failed to create user.');
        }
    };

    const inputItems = (): InputItem[] => {
        return [
            {
                title: 'First Name',
                placeholder: 'Enter first name',
                type: 'input',
                name: 'firstname',
                defaultValue: "",
                required: true,
            },
            {
                title: 'Last Name',
                placeholder: 'Enter last name',
                type: 'input',
                name: 'lastname',
                defaultValue: "",
                required: true,
            },
            {
                title: 'Email',
                placeholder: 'Enter email',
                type: 'email',
                name: 'email',
                defaultValue: "",
                required: true,
            },
            {
                title: 'Password',
                placeholder: 'Enter password',
                type: 'password',
                name: 'password',
                defaultValue: "",
                required: true,
            },
            {
                title: 'Phone',
                placeholder: 'Enter phone number',
                type: 'phone',
                name: 'phone',
                defaultValue: "",
                required: true,
            },
            {
                title: 'Country',
                placeholder: 'Select a country',
                type: 'country',
                name: 'country',
                defaultValue: "",
                required: true,
            },
            {
                title: 'Birthdate',
                placeholder: 'Enter birthdate',
                type: 'input', // or use 'date' if supported
                name: 'birthdate',
                defaultValue: "",
                required: false,
            },
            {
                title: 'Biography',
                placeholder: 'Enter biography',
                type: 'area',
                name: 'biography',
                defaultValue: "",
                required: false,
            },
            {
                title: 'Position',
                placeholder: 'Enter position',
                type: 'input',
                name: 'position',
                defaultValue: "",
                required: true,
            },
            {
                title: 'Organisation',
                placeholder: 'Enter organisation',
                type: 'input',
                name: 'organisation',
                defaultValue: "",
                required: true,
            },
            {
                title: 'Role',
                placeholder: 'Select role',
                type: 'select',
                name: 'role',
                defaultValue: "",
                required: false,
                options: [
                    {label: 'User', value: ''},
                    {label: 'Admin', value: 'admin'},
                ],
            },
            {
                title: 'Profile Image URL',
                placeholder: 'Enter profile image URL',
                type: 'input',
                name: 'profileImage',
                defaultValue: "",
                required: false,
            },
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
                    <h4 className="mb-3">Create User</h4>
                    {alertMessage && <p className="text-info">{alertMessage}</p>}
                    <ReusableForm
                        inputItems={inputItems()}
                        submitButtonTitle={isCreating ? 'Creating...' : 'Create User'}
                        onSubmit={handleFormSubmit}
                        disableSubmitInitially={false}
                    />
                </>
            }
        />
    );
};

export default CreateUserModal;