import React from 'react';
import { FC } from 'react';
import ReusableForm, { InputItem } from 'components/reuseable/Form';
import UserData, { MutableUserData } from 'backend/models/user';
import { useState, useEffect } from 'react';
import { useAuth } from 'auth/AuthProvider';
import DeleteAccountModal from './DeleteAccountModal';

const Account: FC = () => {

    const [user, setUser] = useState<UserData | null>(null)
    const [alertStatus, setAlertStatus] = useState<'success' | 'failed' | null>(null)
    const { fetchUserData, updateUserData, signout } = useAuth()
    const deleteModalID = "delete-account-modal"

    useEffect(() => {
        const getUserData = async () => {
            const userData = await fetchUserData()
            if (userData === null) {
                setAlertStatus('failed')
                return
            }
            setUser(userData)
        }
        getUserData()
    }, []);

    const handleFormSubmit = (values: Record<string, string>) => {
        setAlertStatus(null)
        if (user === null) { return }
        const mutableUserData = createMutableUserData(user, values);
        const update = async () => {
            const newUser = await updateUserData(mutableUserData, user.id)
            if (newUser === null) {
                setAlertStatus('failed')
            } else {
                setAlertStatus('success')
                setUser(newUser)
            }
        }
        update()
    };

    const successAlert = () => {
        return (
            <div className="alert alert-success alert-icon alert-dismissible fade show" role="alert">
                <i className="uil uil-check-circle" /> Successfully updated your account details.{' '}
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" />
            </div>
        )
    }

    const failedAlert = () => {
        return (
            <div className={`alert alert-danger alert-icon alert${user === null ? "" : "-dismissible"} fade show`} role="alert">
                <i className="uil uil-times-circle" /> Failed to {user === null ? "load" : "update"} account profile. Please log out and try again.{' '}
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" />
            </div>
        )
    }

    return (
        <section className="wrapper bg-soft-primary">
            <div className='text-center py-md-8 py-4'>
                <h3>Account</h3>
            </div>
            <div className="container">
                <div className='row px-md-12 px-4'>
                    {alertStatus === 'success' && successAlert()}
                    {alertStatus === 'failed' && failedAlert()}
                </div>
            </div>
            <div className="container">
                <div className="pb-8 px-8">
                    {user &&
                        <ReusableForm
                            inputItems={convertToInputItems(user)}
                            submitButtonTitle="Update Account Details"
                            onSubmit={handleFormSubmit}
                            additionalButtons={[
                                <button key='1' type="button" onClick={signout} className="btn btn-outline-red btn-sm m-4">Log Out</button>,
                                <button
                                    key='2'
                                    type="button"
                                    className="btn btn-outline-red btn-sm m-4"
                                    data-bs-toggle="modal"
                                    data-bs-target={`#${deleteModalID}`}>
                                    Delete Account
                                </button>
                            ]}
                        />}
                </div>
            </div>
            {
                user && <DeleteAccountModal modalID={deleteModalID} userData={createMutableUserData(user)} userID={user.id} />
            }
        </section>
    );

};

export default Account;

const convertToInputItems = (userData: UserData): InputItem[] => {
    return [
        {
            title: 'First Name',
            placeholder: 'Enter first name',
            type: 'input',
            name: 'firstname',
            defaultValue: userData.firstname,
        },
        {
            title: 'Last Name',
            placeholder: 'Enter last name',
            type: 'input',
            name: 'lastname',
            defaultValue: userData.lastname,
        },
        {
            title: 'Phone',
            placeholder: 'Enter phone number',
            type: 'input',
            name: 'phone',
            defaultValue: userData.phone,
        },
        {
            title: 'Country',
            placeholder: 'Enter country',
            type: 'country',
            name: 'country',
            defaultValue: userData.country,
        },
        {
            title: 'Position',
            placeholder: 'Enter position',
            type: 'input',
            name: 'position',
            defaultValue: userData.position,
        },
        {
            title: 'Organisation',
            placeholder: 'Enter organisation',
            type: 'input',
            name: 'organisation',
            defaultValue: userData.organisation,
        },
        {
            title: 'Biography',
            placeholder: 'Enter biography',
            type: 'area',
            name: 'biography',
            defaultValue: userData.biography,
        },
    ];
};

const createMutableUserData = (userData: UserData, updatedValues?: Record<string, string>): MutableUserData => {
    // Create a new object with the same values as userData
    const mutableUserData: MutableUserData = {
        firstname: userData.firstname,
        lastname: userData.lastname,
        phone: userData.phone,
        country: userData.country,
        birthdate: userData.birthdate,
        profileName: userData.profileName,
        profileTitle: userData.profileTitle,
        isNewsletterSubscribe: userData.isNewsletterSubscribe,
        isProfileRestricted: userData.isProfileRestricted,
        interests: userData.interests,
        skills: userData.skills,
        biography: userData.biography,
        position: userData.position,
        organisation: userData.organisation,
        profileImage: userData.profileImage,
        topics: userData.topics,
    };

    // Update mutableUserData with any changed values from updatedValues
    if (updatedValues) {
        for (const key in updatedValues) {
            if (updatedValues.hasOwnProperty(key) && key in mutableUserData) {
                (mutableUserData as any)[key] = updatedValues[key];
            }
        }
    }

    return mutableUserData;
};