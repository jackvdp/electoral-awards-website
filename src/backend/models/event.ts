import mongoose, { Document } from 'mongoose';

interface IEvent extends Document {
  title: string;
  startDate: Date;
  endDate: Date;
  imageURL: string;
  description: string;
  location: string;
}

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  imageURL: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
});

const Event = mongoose.models.Event || mongoose.model<IEvent>('Event', eventSchema);

export type { IEvent, eventSchema };
export default Event;
