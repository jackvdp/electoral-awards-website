import React, {useState} from 'react';
import ReusableForm, {InputItem} from 'components/reuseable/Form';
import {CreateUserData} from 'backend/models/user';
import {useAuth} from 'auth/useAuth';

interface RegisterProps {
    heading?: string;
    description?: string;
    onSuccess?: () => void;
}

const Register: React.FC<RegisterProps> = ({ heading, description, onSuccess }) => {
    const {createUser, error: authError} = useAuth();
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [passwordMismatch, setPasswordMismatch] = useState<boolean>(false);

    const handleFormSubmit = (values: Record<string, string>) => {
        setShowAlert(false);
        setPasswordMismatch(false);

        if (values.password !== values.confirmPassword) {
            setPasswordMismatch(true);
            return;
        }

        const userModel = createUserData(values);
        const create = async () => {
            const success = await createUser(userModel);
            if (success) {
                onSuccess?.();
            } else {
                setShowAlert(true);
            }
        }
        create()
    };

    const isUserExists = authError?.message?.toLowerCase().includes('already registered')
        || authError?.message?.toLowerCase().includes('already been registered');

    const failedAlert = () => {
        return (
            <div className={`alert alert-danger alert-icon alert-dismissible fade show`} role="alert">
                <i className="uil uil-times-circle"/>{' '}
                {isUserExists ? (
                    <>
                        An account with this email address already exists. Please{' '}
                        <a href="#" data-bs-toggle="modal" data-bs-target="#modal-signin" className="alert-link text-decoration-underline">sign in</a>{' '}
                        instead, or use a different email address.
                    </>
                ) : (
                    'Failed to create account profile. Please try again.'
                )}
                {' '}
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"/>
            </div>
        )
    }

    return (
        <div className='row'>
            <div className="col-lg-10 offset-lg-1 col-xl-8 offset-xl-2">
                <h2 className="display-4 mb-3 text-center">{heading || 'Become a member'}</h2>
                <p className="lead text-center mb-10">
                    {description || 'Gain exclusive access to events, webinars, and expert connections.'}
                </p>

                <div className="container">
                    <div className='row px-md-12 px-4'>
                        {showAlert && failedAlert()}
                        {passwordMismatch && (
                            <div className="alert alert-danger alert-icon alert-dismissible fade show" role="alert">
                                <i className="uil uil-times-circle"/> Passwords do not match. Please try again.{' '}
                                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"
                                    onClick={() => setPasswordMismatch(false)} />
                            </div>
                        )}
                    </div>
                </div>

                <ReusableForm
                    inputItems={inputItems()}
                    submitButtonTitle="Sign Up"
                    onSubmit={handleFormSubmit}
                    disableSubmitInitially={false}
                />
            </div>
        </div>
    );
};

export default Register;

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
            title: 'Password',
            placeholder: 'Enter your password',
            type: 'password',
            name: 'password',
            defaultValue: "",
            required: true,
        },
        {
            title: 'Confirm Password',
            placeholder: 'Re-enter your password',
            type: 'password',
            name: 'confirmPassword',
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
            title: 'Phone',
            placeholder: 'Enter phone number',
            type: 'phone',
            name: 'phone',
            defaultValue: "",
            required: true,
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
            title: 'Country',
            placeholder: "-- Please select a country --",
            type: 'country',
            name: 'country',
            defaultValue: "",
            required: true,
        },
    ];
};

const createUserData = (values: Record<string, string>): CreateUserData => {
    return {
        firstname: values.firstname,
        lastname: values.lastname,
        email: values.email,
        password: values.password,
        phone: values.phone,
        country: values.country,
        birthdate: "",
        biography: "",
        position: values.position,
        organisation: values.organisation,
        profileImage: "",
    };
}