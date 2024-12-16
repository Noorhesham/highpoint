import mongoose, { Schema } from "mongoose";

export const imageSchema = new Schema({
  secure_url: { type: String, required: true },
  public_id: { type: String, required: true },
});

export const localizedStringSchema = new Schema({
  en: { type: String, required: true },
  ar: { type: String, required: true },
});

export interface CourseProps {
  name: { ar: string; en: string };
  description: { ar: string; en: string };
  price: number;
  images: { secure_url: string; public_id: string }[];
  category: Schema.Types.ObjectId | string | any;
  serialNumber: number;
  duration: number;
  _id: string;
  startDate: Date;
  endDate: Date;
  status: "draft" | "published" | "archived";
}

const courseSchema = new Schema({
  name: localizedStringSchema,
  description: localizedStringSchema,
  price: { type: Number, required: true },
  images: [imageSchema],
  category: { type: Schema.Types.ObjectId, ref: "Category" },
  serialNumber: { type: Number, required: true },
  duration: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["draft", "published", "archived"],
    default: "draft",
    required: true,
  },
});

courseSchema.pre("find", function (this) {
  this.populate("category"); // Ensure you populate the now relationship model.
});

const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);

export default Course;
