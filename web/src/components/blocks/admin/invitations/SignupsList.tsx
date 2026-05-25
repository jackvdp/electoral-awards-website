import React from "react";
import {IEvent} from "backend/models/event";
import {IBooking} from "backend/models/booking";

interface Signup { event: IEvent, booking: IBooking }

export default function UserSignUpsList({ currentSignups, handleRemoveSignup }: { currentSignups: Signup[], handleRemoveSignup: (signup: Signup) => void }) {
    return (
        <div className="mb-4">
            <h5>Currently Signed Up Events:</h5>
            {currentSignups.length === 0 ? (
                <p>No current signups.</p>
            ) : (
                <ul className="list-group">
                    {currentSignups.map(signup => (
                        <li key={signup.booking._id as string}
                            className="list-group-item d-flex justify-content-between align-items-center">
                            {signup.event.title}
                            <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleRemoveSignup(signup)}
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}