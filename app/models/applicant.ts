import mongoose, { Schema, Document } from "mongoose";

export interface Applicant extends Document {
  course: { type: Schema.Types.ObjectId; ref: "Course"; required: true };
  fullName: string;
  title: string;
  email: string;
  address: string;
  company?: string;
  jobTitle?: string;
  city: string;
  country: string;
  phone: string;
  fax?: string;
  mobilePhone?: string;
  paymentMethod: string;
  agreeToTerms: boolean;
  additionalNotes?: string;
  createdAt: Date;
  firstName: string;
  lastName: string;
}

const ApplicantSchema = new Schema<Applicant>({
  course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  firstName: { type: String, required: true }, // Full name of the applicant
  lastName: { type: String, required: true }, // Full name of the applicant
  title: { type: String, required: true }, // e.g., Mr., Ms., Dr.
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  company: { type: String }, // Optional
  jobTitle: { type: String }, // Optional
  city: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, required: true },
  fax: { type: String }, // Optional
  mobilePhone: { type: String }, // Optional
  // paymentMethod: { type: String, required: true }, // e.g., Personal, Company
  agreeToTerms: { type: Boolean, required: true }, // Checkbox for agreement
  additionalNotes: { type: String }, // Optional field for any additional notes
  createdAt: { type: Date, default: Date.now },
});

const ApplicantModel = mongoose.models.Applicant || mongoose.model("Applicant", ApplicantSchema);

export default ApplicantModel;
