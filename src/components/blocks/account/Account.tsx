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
import ChangePasswordFormModal from "./ChangePasswordForm";
import formatEventDates from "../../../helpers/formatEventDates";
import {router} from "next/client";
import {IEvent} from "../../../backend/models/event";

interface AccountProps {
    user: MutableUserData
}

const Account: FC<AccountProps> = ({user}) => {
    const [alertStatus, setAlertStatus] = useState<'success' | 'failed' | null>(null);
    const [myEvents, setMyEvents] = useState<IEvent[]>([]);
    const {updateUser, signout} = useAuth();
    const deleteModalID = 'delete-account-modal';

    // Define the quick-access links for the sidebar
    const quickAccssLinks = [
        {title: 'Signed-Up Events', url: 'signed-up-events'},
        {title: 'Account Details', url: 'account-details'},
        {title: 'Change Password', url: 'change-password'},
        {title: 'Account Actions', url: 'account-actions'},
    ];

    // Fetch events the user signed up for
    useEffect(() => {
        if (user) {
            fetch(`/api/users/signups?userId=${user.id}`)
                .then((res) => res.json())
                .then((data) => setMyEvents(data))
                .catch((err) => console.error('Error fetching signed-up events:', err));
        }
    }, [user]);

    function handleSignout() {
        signout();
        router.push('/');
    }

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
            <div className="text-center pt-md-12 pt-6">
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
                            {/* Section 2: Signed-Up Events */}
                            <hr className="my-8"/>
                            <section id="signed-up-events" className="mb-12 ps-4">
                                <h4 className={"mb-4"}>Your Signed-Up Events:</h4>
                                {myEvents.length > 0 ? (
                                    <ul className="list-group">
                                        {myEvents.map((event) => (
                                            <li
                                                key={event._id as string}
                                                className="list-group-item d-flex justify-content-between align-items-center"
                                            >
                                                <div>
                                                    <a className="hover" href={`/events/${event._id}`}>
                                                        {event.title}
                                                    </a>
                                                    <div className="text-muted">
                                                        {formatEventDates(event.startDate, event.endDate)}
                                                    </div>
                                                </div>
                                                <a
                                                    className="hover text-danger"
                                                    data-bs-toggle="modal"
                                                    data-bs-target={`#cancel-signup-modal-${event._id}`}
                                                >
                                                    Cancel
                                                </a>
                                                <CancelSignupModal
                                                    modalID={`cancel-signup-modal-${event._id}`}
                                                    event={event}
                                                    onCancelled={() =>
                                                        setMyEvents((prev) => prev.filter((e) => e._id !== event._id))
                                                    }
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>
                                        You haven&apos;t signed up for any events.{' '}
                                        <NextLink href="/events" title="View Events"/>
                                    </p>
                                )}
                            </section>
                            {/* Section 1: Account Details (Avatar and Form) */}
                            <hr className="my-8"/>
                            <section id="account-details" className="mb-12">
                                {user && (
                                    <>
                                        <div className="d-flex align-items-center mb-8 ps-4">
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

                            {/* Section 3: Change Password */}
                            <hr className="my-8"/>
                            <section id="change-password" className="mb-12 ps-4">
                                <h4 className="mb-4">Change Password:</h4>
                                <p>To change your password, please click the button below.</p>
                                <button
                                    className={"btn btn-outline-primary"}
                                    data-bs-toggle="modal"
                                    data-bs-target="#modal-change-password"
                                >
                                    Change Password
                                </button>
                                <ChangePasswordFormModal modalID={"modal-change-password"}/>
                            </section>
                            <hr className="my-8"/>
                            {/* Section 4: Account Actions */}
                            <section id="account-actions" className={"ps-4 mb-12"}>
                                <div className="d-flex flex-column gap-4">
                                    <h4>Account Actions:</h4>
                                    <div>
                                        <button
                                            type="button"
                                            onClick={handleSignout}
                                            className="btn btn-outline-red btn-sm"
                                        >
                                            Log Out
                                        </button>
                                    </div>
                                    <div>
                                        <a
                                            className="hover link-red"
                                            data-bs-toggle="modal"
                                            data-bs-target={`#${deleteModalID}`}
                                        >
                                            Delete Account
                                        </a>
                                    </div>
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
                                                offset={-200}
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