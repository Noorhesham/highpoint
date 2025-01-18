import { OperationProps } from "@/app/models/Operations";
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
  subCategories: Schema.Types.ObjectId[] | string[];
  city: Schema.Types.ObjectId | string;
  days: { ar: string; en: string }[];
  operations: OperationProps[];
}

const courseSchema = new Schema(
  {
    name: localizedStringSchema,
    shortDescription: localizedStringSchema,
    courseContent: localizedStringSchema,
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
    subCategories: [{ type: Schema.Types.ObjectId, ref: "SubCategory" }],
    city: { type: Schema.Types.ObjectId, ref: "City" },
    days: [localizedStringSchema],
    certificate: {
      name: localizedStringSchema,
      image: imageSchema,
      desc: localizedStringSchema,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
courseSchema.virtual("operations", {
  ref: "Operation",
  localField: "_id",
  foreignField: "course",
});
courseSchema.pre("find", function (this) {
  this.populate("category");
  this.populate("subCategories");
  this.populate("operations");
  this.populate("city");
});

const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);

export default Course;
