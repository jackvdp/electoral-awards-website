import React, { useEffect, useState } from 'react';
import NextLink from 'components/reuseable/links/NextLink';
import FigureImage from 'components/reuseable/FigureImage';
import styles from './Events.module.css';

interface EventPreview {
    title: string;
    imageURL: string;
    startDate: string;
    _id: string;
}

interface EventsSidebarProps {
    ignoreLimit?: boolean;
}

const EventsSidebar: React.FC<EventsSidebarProps> = ({ ignoreLimit }) => {
    const [events, setEvents] = useState<EventPreview[]>([]);

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

    const futureEvents: EventPreview[] = (
        events.filter(event => {
            return new Date(event.startDate).getTime() > Date.now();
        }).sort((a, b) => {
            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        })
    )

    const pastEvents: EventPreview[] = (() => {
        const pEvents = events.filter(event => new Date(event.startDate).getTime() < Date.now())
            .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        return ignoreLimit ? pEvents : pEvents.slice(0, Math.max(5 - futureEvents.length, 0));
    })();
    

    return (
        <div>
            {section('Upcoming Events', futureEvents)}
            {pastEvents.length > 0 && section('Past Events', pastEvents)}
        </div>
    );

    function section(title: string, events: EventPreview[]) {
        return (
            <div className="widget">
                <h4 className="widget-title mb-3">{title}</h4>

                <ul className="image-list">
                    {events.map(({ title, imageURL, _id, startDate }) => {
                        return _id && (
                            <li key={_id}>
                                <NextLink title={<FigureImage width={100} height={100} className="rounded" src={imageURL === "" ? "https://electoralwebsite.s3.amazonaws.com/images/1703698906135-logo.png" : imageURL} />} href={`/events/${_id}`} />

                                <div className="post-content">
                                    <b className="mb-2">
                                        <NextLink className={`link-dark ${styles.twoLineText}`} title={title} href={`/events/${_id}`} />
                                    </b>

                                    <ul className="post-meta">
                                        <li className="post-date">
                                            <i className="uil uil-calendar-alt" />
                                            <span>{new Date(startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}</span>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        )
    }
};

export default EventsSidebar;