import React, { useEffect, useState } from 'react';
import NextLink from 'components/reuseable/links/NextLink';
import FigureImage from 'components/reuseable/FigureImage';
import { IEvent } from 'backend/models/event';
import styles from './Events.module.css';

const EventsSidebar: React.FC = () => {
    const [events, setEvents] = useState<IEvent[]>([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('/api/events/preview');
                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, []);

    const sortedEvents = () => {
        return events.filter(event => {
            return new Date(event.startDate).getTime() > Date.now();
        }).sort((a, b) => {
            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        });
    }

    return (
        <div className="widget">
            <h4 className="widget-title mb-3">Upcoming Events</h4>

            <ul className="image-list">
                {sortedEvents().map(({ title, imageURL, _id, startDate }, index) => {
                    return _id && (
                        <li key={_id}>
                            <NextLink title={<FigureImage width={100} height={100} className="rounded" src={imageURL} />} href="#" />

                            <div className="post-content">
                                <b className="mb-2">
                                    <NextLink className={`link-dark ${styles.twoLineText}`} title={title} href={`/events/${_id}`} />
                                </b>

                                <ul className="post-meta">
                                    <li className="post-date">
                                        <i className="uil uil-calendar-alt" />
                                        <span>{new Date(startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit'})}</span>
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

export default EventsSidebar;