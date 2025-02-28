import React, {useEffect, useState} from 'react';
import NextLink from 'components/reuseable/links/NextLink';
import FigureImage from 'components/reuseable/FigureImage';
import styles from './Events.module.css';
import SquareImage from "../../reuseable/SquareImage";
import formatEventDates from "../../../helpers/formatEventDates";

interface EventPreview {
    title: string;
    imageURL: string;
    startDate: string;
    endDate: string;
    _id: string;
}

interface EventsSidebarProps {
    ignoreLimit?: boolean;
}

const EventsSidebar: React.FC<EventsSidebarProps> = ({ignoreLimit}) => {
    const [events, setEvents] = useState<EventPreview[]>([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('/api/events/preview');
                if (!response.ok) {
                    console.error('Failed to fetch events:', response);
                    setEvents([])
                    return;
                }
                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error('Error fetching events:', error);
                setEvents([]); // Set to empty array on error
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
            .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        return ignoreLimit ? pEvents : pEvents.slice(0, Math.max(5 - futureEvents.length, 0));
    })();

    function section(title: string, events: EventPreview[]) {
        return (
            <div className="widget mb-3 mt-8 mt-md-0">
                <h3 className="widget-title mb-6">{title}</h3>

                <ul className="image-list">
                    {events.map(({title, imageURL, _id, startDate, endDate}) => {
                        return _id && (
                            <li key={_id}>
                                {imageURL !== "" && <NextLink
                                    title={<SquareImage width={100} height={100} className="rounded" src={imageURL}/>}
                                    href={`/events/${_id}`}/>}

                                <div className={imageURL && "post-content"}>
                                    <p className="mb-2">
                                        <NextLink className={`link-dark ${styles.twoLineText}`} title={title}
                                                  href={`/events/${_id}`}/>
                                    </p>

                                    <ul className="post-meta">
                                        <li className="post-date">
                                            <i className="uil uil-calendar-alt"/>
                                            <span>{formatEventDates(startDate, endDate, 'no-time')}</span>
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

    return (
        <>
            {section('Upcoming Events', futureEvents)}
            {pastEvents.length > 0 && section('Past Events', pastEvents)}
        </>
    );

};

export default EventsSidebar;

