import { FC } from "react"
import { Speaker } from "data/events"

type SpeakerProp = {
    speaker: Speaker
}

const SpeakerCard: FC<SpeakerProp> = ({speaker}) => {
    return (
        <div className="card">
            <div className="card-body">
                <h5 className='card-title'>{speaker.name}</h5>
                {
                    speaker.organization ?
                        <p className="card-text">{speaker.title}, {speaker.organization}</p> :
                        <p className="card-text">{speaker.title}</p>
                }
            </div>
        </div>
    )
}

export default SpeakerCard