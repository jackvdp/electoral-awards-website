import mongoose, {Document} from 'mongoose';

export interface IEvent extends Document {
    title: string;
    startDate: Date;
    endDate: Date;
    imageURL?: string;
    description: string;
    location: string;
    signups: string[];
}

const eventSchema = new mongoose.Schema({
    title: {type: String, required: true},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    imageURL: {type: String},
    description: {type: String, required: true},
    location: {type: String, required: true},
    signups: {type: [String], default: []},
});

const Event = mongoose.models.Event || mongoose.model<IEvent>('Event', eventSchema);
export default Event;
