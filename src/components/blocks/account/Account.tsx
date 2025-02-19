// Account.tsx
import React, {FC, useEffect, useState} from 'react';
import ReusableForm, {InputItem} from 'components/reuseable/Form';
import {MutableUserData} from 'backend/models/user';
import {useAuth} from 'auth/useAuth';
import DeleteAccountModal from './DeleteAccountModal';
import CancelSignupModal from "./CancelSignupModal";

interface Event {
    _id: string;
    title: string;
    // add other event properties as needed
}

const Account: FC = () => {
    const [user, setUser] = useState<MutableUserData | null>(null);
    const [alertStatus, setAlertStatus] = useState<'success' | 'failed' | null>(null);
    const [myEvents, setMyEvents] = useState<Event[]>([]);
    const {getUser, updateUser, signout} = useAuth();
    const deleteModalID = 'delete-account-modal';

    useEffect(() => {
        const getUserData = async () => {
            const userData = await getUser();
            if (userData === null) {
                setAlertStatus('failed');
                return;
            }
            setUser(userData);
        };
        getUserData();
    }, []);

    // Fetch the events the user signed up for
    useEffect(() => {
        if (user) {
            fetch(`/api/events/mySignups?userId=${user.id}`)
                .then((res) => res.json())
                .then((data) => setMyEvents(data))
                .catch((err) => console.error('Error fetching signed-up events:', err));
        }
    }, [user]);

    const handleFormSubmit = (values: Record<string, string>) => {
        setAlertStatus(null);
        if (user === null) return;
        const mutableUserData = editUserData(user, values);
        const update = async () => {
            const newUser = await updateUser(mutableUserData, user.id);
            if (newUser === null) {
                setAlertStatus('failed');
            } else {
                setAlertStatus('success');
                setUser(newUser);
            }
        };
        update();
    };

    const successAlert = () => (
        <div className="alert alert-success alert-icon alert-dismissible fade show" role="alert">
            <i className="uil uil-check-circle"/> Successfully updated your account details.{' '}
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"/>
        </div>
    );

    const failedAlert = () => (
        <div className={`alert alert-danger alert-icon alert${user === null ? '' : '-dismissible'} fade show`}
             role="alert">
            <i className="uil uil-times-circle"/> Failed to {user === null ? 'load' : 'update'} account profile.
            Please log out and try again.{' '}
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"/>
        </div>
    );

    return (
        <section className="wrapper bg-soft-primary">
            <div className="text-center py-md-8 py-4">
                <h3>Account</h3>
            </div>
            <div className="container">
                <div className="row px-md-12 px-4">
                    {alertStatus === 'success' && successAlert()}
                    {alertStatus === 'failed' && failedAlert()}
                </div>
            </div>
            <div className="container">
                <div className="pb-8 px-8 d-flex flex-column align-items-center">
                    {user && (
                        <>
              <span className="avatar bg-pale-primary text-primary w-15 h-15 mb-8">
                <span className="text-uppercase fs-32">{user.firstname.charAt(0) + user.lastname.charAt(0)}</span>
              </span>
                            <ReusableForm
                                inputItems={convertToInputItems(user)}
                                submitButtonTitle="Update Account Details"
                                onSubmit={handleFormSubmit}
                                disableSubmitInitially={true}
                            />
                        </>
                    )}
                    <div className="d-flex flex-column gap-4">
                        <button key="1" type="button" onClick={signout} className="btn btn-outline-red btn-sm">
                            Log Out
                        </button>
                        <a key="2" className="hover link-red" data-bs-toggle="modal"
                           data-bs-target={`#${deleteModalID}`}>
                            Delete Account
                        </a>
                    </div>
                    {/* Display signed-up events with a cancel (trash) button */}
                    {myEvents.length > 0 && (
                        <div className="mt-6 w-100">
                            <h4>Your Signed-Up Events:</h4>
                            <ul className="list-group">
                                {myEvents.map((event) => (
                                    <li
                                        key={event._id}
                                        className="list-group-item d-flex justify-content-between align-items-center"
                                    >
                                        <a className="hover" href={`/events/${event._id}`}>{event.title}</a>
                                        <a
                                            className="hover text-danger"
                                            data-bs-toggle="modal"
                                            data-bs-target={`#cancel-signup-modal-${event._id}`}
                                        >
                                            Cancel
                                        </a>
                                        <CancelSignupModal
                                            modalID={`cancel-signup-modal-${event._id}`}
                                            eventId={event._id}
                                            onCancelled={() =>
                                                setMyEvents((prev) => prev.filter((e) => e._id !== event._id))
                                            }
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            {user && <DeleteAccountModal modalID={deleteModalID} userData={user}/>}
        </section>
    );
};

export default Account;

const convertToInputItems = (userData: MutableUserData): InputItem[] => [
    {
        title: 'First Name',
        placeholder: 'Enter first name',
        type: 'input',
        name: 'firstname',
        defaultValue: userData.firstname,
        required: true,
    },
    {
        title: 'Last Name',
        placeholder: 'Enter last name',
        type: 'input',
        name: 'lastname',
        defaultValue: userData.lastname,
        required: true,
    },
    {
        title: 'Phone',
        placeholder: 'Enter phone number',
        type: 'phone',
        name: 'phone',
        defaultValue: userData.phone,
        required: true,
    },
    {
        title: 'Country',
        placeholder: 'Enter country',
        type: 'country',
        name: 'country',
        defaultValue: userData.country,
        required: true,
    },
    {
        title: 'Position',
        placeholder: 'Enter position',
        type: 'input',
        name: 'position',
        defaultValue: userData.position,
        required: true,
    },
    {
        title: 'Organisation',
        placeholder: 'Enter organisation',
        type: 'input',
        name: 'organisation',
        defaultValue: userData.organisation,
        required: true,
    },
    {
        title: 'Biography',
        placeholder: 'Enter biography',
        type: 'area',
        name: 'biography',
        defaultValue: userData.biography,
    },
];

const editUserData = (userData: MutableUserData, updatedValues: Record<string, string>): MutableUserData => {
    for (const key in updatedValues) {
        if (Object.prototype.hasOwnProperty.call(updatedValues, key) && key in userData) {
            (userData as any)[key] = updatedValues[key];
        }
    }
    return userData;
};