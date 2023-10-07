import { FC } from 'react';
import NextLink from 'components/reuseable/links/NextLink';
import { Event } from 'data/events';

type EventCardProps = {
    event: Event;
    index: number;
};

const EventCard: FC<EventCardProps> = ({ event, index }) => {
    const { type, title, time, overview } = event;

    // Truncate the overview to a certain length for display.
    const truncateOverview = (overview: string | undefined, maxLength: number = 100) => {
        if (!overview) return "";
        if (overview.length <= maxLength) return overview;
        return `${overview.substring(0, maxLength)}...`;
    };

    return (
        <article className="item post">
            <div className="card">
                <div className="card-body">
                    <div className="post-header">
                        <div className="post-category text-line">
                            <NextLink title={type} href={`/events/${index}`} className="hover" />
                        </div>

                        <h2 className="post-title h3 mt-1 mb-3">
                            <NextLink title={title} className="link-dark" href={`/events/${index}`} /> {/* Modify the href to point to the event details if needed */}
                        </h2>
                    </div>

                    <div className="post-content">
                        <p>{truncateOverview(overview)}</p>
                    </div>
                </div>

                <div className="card-footer">
                    <ul className="post-meta d-flex mb-0">
                        <li className="post-date">
                            <i className="uil uil-calendar-alt" />
                            <span>{time}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </article>
    );
};

export default EventCard;
