import { FC } from "react";
import { Event } from "data/events";
import SpeakerCard from "./SpeakerCard";

export const EventDetails: FC<EventDetailsProps> = ({ event }) => {

    return (
        <>
            <div className="card">
                <div className="card-body">
                    {event.overview && <p className="card-text">{event.overview}</p>}
                </div>
            </div>

            <h3 className='pb-2 pt-4 text-center'>Speakers:</h3>

            <div className="row">
                {event.speakers.map((speaker, index) => (
                    <div key={index} className="col-12 col-md-6 mb-4">
                        <SpeakerCard speaker={speaker} />
                    </div>
                ))}
            </div>
        </>
    );
}

export interface EventDetailsProps {
    event: Event;
}