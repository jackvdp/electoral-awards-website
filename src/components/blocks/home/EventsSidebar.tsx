import React, { useEffect, useState } from 'react';
import NextLink from 'components/reuseable/links/NextLink';
import FigureImage from 'components/reuseable/FigureImage';
import { IEvent } from 'backend/models/event';

const HomeEventsSidebar: React.FC = () => {
    const [events, setEvents] = useState<IEvent[]>([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('/api/events');
                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, []);

    function sortedEvents() {
        return events.sort((a, b) => {
            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        }).slice(0, 3);
    }

    return (
        <div className="widget">
            <h4 className="widget-title mb-3">Popular Posts</h4>

            <ul className="image-list">
                {sortedEvents().map(({ title, imageURL, _id, startDate }) => {
                    console.log(imageURL)
                    return _id && (
                        <li key={_id}>
                            <NextLink title={<FigureImage width={100} height={100} className="rounded" src={imageURL} />} href="#" />

                            <div className="post-content">
                                <b className="mb-2">
                                    <NextLink className="link-dark" title={title} href="#" />
                                </b>

                                <ul className="post-meta">
                                    <li className="post-date">
                                        <i className="uil uil-calendar-alt" />
                                        <span>{new Date(startDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default HomeEventsSidebar;