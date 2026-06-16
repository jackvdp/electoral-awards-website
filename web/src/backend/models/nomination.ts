// backend/models/nomination.ts
import mongoose, { Document } from 'mongoose';

export interface INominationDocument {
    name: string;
    url: string;
    size: number;
    contentType: string;
}

export interface INomination extends Document {
    // Supabase auth UID of the logged-in submitter, if any
    userId?: string;
    // Nominator
    nominatorName: string;
    nominatorOrganization: string;
    nominatorPosition: string;
    email: string;
    nominatorPhone: string;
    // Nominee
    nomineeName: string;
    nomineePosition?: string;
    nomineeOrganization?: string;
    nomineeEmail: string;
    nomineePhone: string;
    // Award
    awardCategory: string;
    initiativeDescription: string;
    supportingEvidence: string;
    // Reference (optional)
    referenceName?: string;
    referencePosition?: string;
    referenceOrganization?: string;
    referenceEmail?: string;
    referencePhone?: string;
    // Uploaded supporting documents
    documents: INominationDocument[];
}

const documentSchema = new mongoose.Schema<INominationDocument>({
    name: { type: String, required: true },
    url: { type: String, required: true },
    size: { type: Number, required: true },
    contentType: { type: String, required: true },
}, { _id: false });

const nominationSchema = new mongoose.Schema({
    // Supabase auth UID of the logged-in submitter, if any
    userId: { type: String, index: true },
    // Nominator
    nominatorName: { type: String, required: true },
    nominatorOrganization: { type: String, required: true },
    nominatorPosition: { type: String, required: true },
    email: { type: String, required: true },
    nominatorPhone: { type: String, required: true },
    // Nominee
    nomineeName: { type: String, required: true },
    nomineePosition: { type: String },
    nomineeOrganization: { type: String },
    nomineeEmail: { type: String, required: true },
    nomineePhone: { type: String, required: true },
    // Award
    awardCategory: { type: String, required: true },
    initiativeDescription: { type: String, required: true },
    supportingEvidence: { type: String, required: true },
    // Reference (optional)
    referenceName: { type: String },
    referencePosition: { type: String },
    referenceOrganization: { type: String },
    referenceEmail: { type: String },
    referencePhone: { type: String },
    // Uploaded supporting documents
    documents: { type: [documentSchema], default: [] },
}, { timestamps: true });

nominationSchema.index({ awardCategory: 1, createdAt: -1 });

const Nomination = mongoose.models.Nomination || mongoose.model<INomination>('Nomination', nominationSchema);

export default Nomination;
