import React, { useState } from 'react';
import ReusableForm, { InputItem } from 'components/reuseable/Form';
import { CreateUser } from 'backend/models/user';
import { useAuth } from 'auth/AuthProvider';

const Register: React.FC = () => {
    const { createUser } = useAuth();
    const [showAlert, setShowAlert] = useState<boolean>(false);

    const handleFormSubmit = (values: Record<string, string>) => {
        setShowAlert(false)
        
        const userModel = createUserData(values);
        const create = async () => {
            console.log("****")
            const success = await createUser(userModel);
            if (success) {
                console.log(`User created successfully`);
            } else {
                setShowAlert(true);
            }
        }
        create()
    };

    const failedAlert = () => {
        return (
            <div className={`alert alert-danger alert-icon alert-dismissible fade show`} role="alert">
                <i className="uil uil-times-circle" /> Failed to create account profile. Please try again.{' '}
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" />
            </div>
        )
    }

    return (
        <div className='row'>
            <div className="col-lg-10 offset-lg-1 col-xl-8 offset-xl-2">
                <h2 className="display-4 mb-3 text-center">Become a member</h2>
                <p className="lead text-center mb-10">
                    Gain exclusive access to events, webinars, and expert connections.
                </p>

                <div className="container">
                    <div className='row px-md-12 px-4'>
                        {showAlert && failedAlert()}
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
            placeholder: 'Enter your passwrord',
            type: 'password',
            name: 'password',
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

const createUserData = (values: Record<string, string>): CreateUser => {
    return {
        firstname: values.firstname,
        lastname: values.lastname,
        email: values.email,
        password: values.password,
        phone: values.phone,
        country: values.country,
        birthdate: "",
        profileName: values.firstname,
        profileTitle: "",
        isNewsletterSubscribe: false,
        isProfileRestricted: false,
        interests: [],
        skills: [],
        biography: "",
        position: values.position,
        organisation: values.organisation,
        profileImage: "",
        topics: ["Electoral"],
    };
}