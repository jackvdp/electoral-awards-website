import mongoose, {Document} from 'mongoose';

export interface IEvent extends Document {
    title: string;
    startDate: Date;
    endDate: Date;
    imageURL?: string;
    description: string;
    location: string;
    signups: string[];
    speakers: Speaker[]
}

interface Speaker {
    name: string;
    description: string;
    imageURL?: string;
}

const speakerSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    imageURL: {type: String}
});

const eventSchema = new mongoose.Schema({
    title: {type: String, required: true},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    imageURL: {type: String},
    description: {type: String, required: true},
    location: {type: String, required: true},
    signups: {type: [String], default: []},
    speakers: {type: [speakerSchema], default: []},
});

const Event = mongoose.models.Event || mongoose.model<IEvent>('Event', eventSchema);
export default Event;
