import React from 'react';
import ReusableForm, { InputItem } from 'components/reuseable/Form';

const Register: React.FC = () => {

    const handleFormSubmit = (values: Record<string, string>) => {
        console.log(values);
        confirm("Are you sure you want to submit?");
    };

    return (
        <div className='row'>
            <div className="col-lg-10 offset-lg-1 col-xl-8 offset-xl-2">
                <h2 className="display-4 mb-3 text-center">Become a member</h2>
                <p className="lead text-center mb-10">
                    Gain exclusive access to events, webinars, and expert connections.
                </p>

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

