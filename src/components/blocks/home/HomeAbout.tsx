import React from 'react';
import Link from "next/link";

const HomeAbout: React.FC = () => {
    return (
        <>
            <h3 className="display-4 mb-3">Global Network for Electoral Excellence</h3>
            <p className="lead fs-lg lh-sm">Home of the International Electoral Awards &amp; Symposium.</p>
            <p className="mb-3">
                The Electoral Stakeholders&apos; Network unites electoral leaders, experts, and innovators worldwide to
                enhance electoral management and democratic integrity. We achieve this through high-impact <b>events,
                professional training, insightful publications, and our flagship International Electoral Awards</b>,
                which celebrate excellence in the field.
            </p>
            <p className="mb-3">
                Now in its 22nd year, the <b>International Electoral Awards &amp; Symposium</b> is the premier global gathering for electoral professionals. The 2026 edition takes place in <b>Manila, Philippines</b>, co-hosted with the Commission on Elections of the Philippines (COMELEC), and promises to be the largest and most ambitious yet.
            </p>
            <p className="mb-6">
                Through symposiums, webinars, and expert-led discussions, we foster collaboration and share best
                practices on key issues like electoral integrity, technology, and inclusive participation. Join us in
                shaping the future of democratic elections.
            </p>
            <div className="d-flex flex-column flex-md-row gap-2">
                <Link href="/awards" className="btn btn-expand btn-primary rounded-pill">
                    <i className="uil uil-arrow-right"></i>
                    <span>Awards &amp; Symposium</span>
                </Link>
                <Link href="/events" className="btn btn-expand btn-soft-primary rounded-pill">
                    <i className="uil uil-arrow-right"></i>
                    <span>All events</span>
                </Link>
            </div>
        </>
    );
};
export default HomeAbout;
