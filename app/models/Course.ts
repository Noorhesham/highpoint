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
  name: string;
  description: string;
  price: number;
  images: string[];
  category: Schema.Types.ObjectId;
  serialNumber: number;
  duration: number;
}
const courseSchema = new Schema({
  name: localizedStringSchema,
  description: localizedStringSchema,
  price: { type: Number, required: true },
  images: [imageSchema],
  category: { type: Schema.Types.ObjectId, ref: "Category" },
  serialNumber: { type: Number, required: true },
  duration: { type: Number, required: true },
});
courseSchema.pre("find", function (this) {
  this.populate("category");
});
const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);
export default Course;
