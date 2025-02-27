// components/admin/CreateUserModal.tsx
import React, {FC, useState} from 'react';
import Modal from 'components/reuseable/modal/Modal';
import ReusableForm from 'components/reuseable/Form';
import {CreateUserData} from 'backend/models/user';
import {useAuth} from 'auth/useAuth';
import inputItems from "../reusables/userInputItems";

interface CreateUserModalProps {
    modalID: string;
    onCreated: () => void;
}

const CreateUserModal: FC<CreateUserModalProps> = ({modalID, onCreated}) => {
    const {createUserWithoutSignup} = useAuth();
    const [isCreating, setIsCreating] = useState(false);
    const [closeModalProgrammatically, setCloseModalProgrammatically] = useState(false);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    // Build a CreateUserData object from form values.
    const buildUserData = (values: Record<string, string>): CreateUserData => ({
        firstname: values.firstname,
        lastname: values.lastname,
        email: values.email,
        password: randomAlphaNumericRandomPassword(),
        phone: values.phone,
        country: values.country,
        birthdate: values.birthdate || "",
        biography: values.biography || "",
        position: values.position,
        organisation: values.organisation,
        profileImage: values.profileImage || "",
        role: values.role || "user",
    });

    const randomAlphaNumericRandomPassword = () => {
        const randomAlphaNumeric = () => {
            const alphaNumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            return alphaNumeric.charAt(Math.floor(Math.random() * alphaNumeric.length));
        };
        return Array.from({length: 10}, randomAlphaNumeric).join('');
    }

    const handleFormSubmit = async (values: Record<string, string>) => {
        setAlertMessage(null);
        setIsCreating(true);
        const userData = buildUserData(values);
        const success = await createUserWithoutSignup(userData);
        setIsCreating(false);
        if (success) {
            setAlertMessage('User created successfully.');
            setCloseModalProgrammatically(true);
            onCreated();
        } else {
            setAlertMessage('Failed to create user.');
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