// Account.tsx
import React, {FC, useEffect, useState} from 'react';
import ReusableForm from 'components/reuseable/Form';
import {MutableUserData} from 'backend/models/user';
import {useAuth} from 'auth/useAuth';
import DeleteAccountModal from './DeleteAccountModal';
import CancelSignupModal from './CancelSignupModal';
import convertToInputItems from './convertToInputItems';
import editUserData from './editUserData';
import NextLink from 'components/reuseable/links/NextLink';
import {Link as ScrollLink} from 'react-scroll';

interface Event {
    _id: string;
    title: string;
}

const Account: FC = () => {
    const [user, setUser] = useState<MutableUserData | null>(null);
    const [alertStatus, setAlertStatus] = useState<'success' | 'failed' | null>(null);
    const [myEvents, setMyEvents] = useState<Event[]>([]);
    const {getUser, updateUser, signout} = useAuth();
    const deleteModalID = 'delete-account-modal';

    // Define the quick-access links for the sidebar
    const quickAccssLinks = [
        {title: 'Account Details', url: 'account-details'},
        {title: 'Signed-Up Events', url: 'signed-up-events'},
        {title: 'Account Actions', url: 'account-actions'},
    ];

    // Load user details
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

    // Fetch events the user signed up for
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
        (async () => {
            const newUser = await updateUser(mutableUserData, user.id);
            if (newUser === null) {
                setAlertStatus('failed');
            } else {
                setAlertStatus('success');
                setUser(newUser);
            }
        })();
    };

    const successAlert = () => (
        <div className="alert alert-success alert-icon alert-dismissible fade show" role="alert">
            <i className="uil uil-check-circle"/> Successfully updated your account details.{' '}
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"/>
        </div>
    );

    const failedAlert = () => (
        <div
            className={`alert alert-danger alert-icon alert${user === null ? '' : '-dismissible'} fade show`}
            role="alert"
        >
            <i className="uil uil-times-circle"/> Failed to {user === null ? 'load' : 'update'} account profile.
            Please log out and try again.{' '}
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"/>
        </div>
    );

    return (
        <section className="wrapper bg-soft-primary">
            <div className="text-center pt-md-8 pt-4 pb-md-4 pb-2">
                <h3>Account</h3>
            </div>
            <div className="container">
                {/* Alerts Row */}
                <div className="row px-md-12 px-4">
                    {alertStatus === 'success' && successAlert()}
                    {alertStatus === 'failed' && failedAlert()}
                </div>
                <div className="row">
                    {/* Left Column: All Main Content */}
                    <div className="col-xl-10 order-xl-2">
                        <div className="pb-8 px-8">
                            {/* Section 1: Account Details (Avatar and Form) */}
                            <section id="account-details" className="mb-12">
                                {user && (
                                    <>
                                        <div className="d-flex align-items-center mb-4 ps-4">
                                            <span className="avatar bg-pale-primary text-primary w-15 h-15 me-2">
                                              <span className="text-uppercase fs-32">
                                                {user.firstname.charAt(0) + user.lastname.charAt(0)}
                                              </span>
                                            </span>
                                            <div>
                                                <p className="mb-0 fw-bold">{user.firstname} {user.lastname}</p>
                                                <p className="mb-0">{user.email}</p>
                                            </div>
                                        </div>
                                        <ReusableForm
                                            inputItems={convertToInputItems(user)}
                                            submitButtonTitle="Update Account Details"
                                            onSubmit={handleFormSubmit}
                                            disableSubmitInitially={true}
                                        />
                                    </>
                                )}
                            </section>
                            {/* Section 2: Signed-Up Events */}
                            <section id="signed-up-events" className="mb-12 ps-4">
                                <h4>Your Signed-Up Events:</h4>
                                {myEvents.length > 0 ? (
                                    <ul className="list-group">
                                        {myEvents.map((event) => (
                                            <li
                                                key={event._id}
                                                className="list-group-item d-flex justify-content-between align-items-center"
                                            >
                                                <a className="hover" href={`/events/${event._id}`}>
                                                    {event.title}
                                                </a>
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
                                ) : (
                                    <p>
                                        You haven't signed up for any events.{' '}
                                        <NextLink href="/events" title="View Events"/>
                                    </p>
                                )}
                            </section>
                            {/* Section 3: Account Actions */}
                            <section id="account-actions" className={"ps-4 mb-12"}>
                                <div className="d-flex flex-column gap-4">
                                    <h4>Account Actions:</h4>
                                    <div>
                                        <button
                                            type="button"
                                            onClick={signout}
                                            className="btn btn-outline-red btn-sm"
                                        >
                                            Log Out
                                        </button>
                                    </div>
                                    <a
                                        className="hover link-red"
                                        data-bs-toggle="modal"
                                        data-bs-target={`#${deleteModalID}`}
                                    >
                                        Delete Account
                                    </a>
                                </div>
                            </section>
                        </div>
                    </div>
                    {/* Right Column: Sticky Sidebar */}
                    <aside
                        className="col-xl-2 order-xl-2 sidebar sticky-sidebar mt-md-0 py-16 d-none d-xl-block"
                        style={{top: 0}}
                    >
                        <div className="widget">
                            <h6 className="widget-title fs-17 mb-2">On this page</h6>
                            <nav id="sidebar-nav">
                                <ul className="list-unstyled fs-sm lh-sm text-reset">
                                    {quickAccssLinks.map((item, i) => (
                                        <li key={i}>
                                            <ScrollLink
                                                smooth
                                                spy
                                                activeClass="active"
                                                to={item.url}
                                                className="nav-link scroll"
                                                offset={-50} // adjust offset if needed for fixed header
                                            >
                                                {item.title}
                                            </ScrollLink>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    </aside>
                </div>
            </div>
            {user && <DeleteAccountModal modalID={deleteModalID} userData={user}/>}
        </section>
    );
};

export default Account;