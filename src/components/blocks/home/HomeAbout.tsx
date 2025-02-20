import React from 'react';

const HomeAbout: React.FC = () => {
    return (
        <>
            <h3 className="display-4 mb-3">Global Network for Electoral Excellence</h3>
            <p className="lead fs-lg lh-sm">Connecting Electoral Leaders, Advancing Excellence in Elections.</p>
            <p className="mb-6">
                The Electoral Stakeholders’ Network unites electoral leaders, experts, and innovators worldwide to
                enhance electoral management and democratic integrity. We achieve this through high-impact <b>events,
                professional training, insightful publications, and our flagship International Electoral Awards</b>,
                which celebrate excellence in the field.
                <br/><br/>
                Through symposiums, webinars, and expert-led discussions, we foster collaboration and share best
                practices on key issues like electoral integrity, technology, and inclusive participation. Join us in
                shaping the future of democratic elections.
                <br/><br/>
                A one-of-a-kind global recognition, the International Electoral Awards honour those driving innovation,
                safeguarding electoral integrity, and advancing democracy. From pioneering electoral reforms to ensuring
                fair and transparent processes, these awards shine a spotlight on individuals and organizations making a
                real impact in securing the future of elections.
            </p>
            <a href="#" className="btn btn-expand btn-primary rounded-pill">
                <i className="uil uil-arrow-right"></i>
                <span>See our events</span>
            </a>
        </>
    );
};
export default HomeAbout;
