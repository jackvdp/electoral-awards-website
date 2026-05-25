import React, {Dispatch, SetStateAction} from "react";

export default function TabNavigation(
    {activeTab, setActiveTab}:
    {activeTab: "signup" | "invite", setActiveTab: Dispatch<SetStateAction<"signup" | "invite">>}
) {
    return <ul className="nav nav-tabs nav-tabs-basic">
        <li className="nav-item">
            <a
                className={`nav-link ${activeTab === 'signup' ? 'active' : ''}`}
                onClick={(e) => {
                    e.preventDefault();
                    setActiveTab('signup');
                }}
                href="#signup-tab"
            >
                Signups
            </a>
        </li>
        <li className="nav-item">
            <a
                className={`nav-link ${activeTab === 'invite' ? 'active' : ''}`}
                onClick={(e) => {
                    e.preventDefault();
                    setActiveTab('invite');
                }}
                href="#invite-tab"
            >
                Invitations
            </a>
        </li>
    </ul>;
}