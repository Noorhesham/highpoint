import mongoose, { Schema } from "mongoose";
import { imageSchema, localizedStringSchema } from "./Course";

export interface SubCategoryProps {
  name: {
    en: string;
    ar: string;
  };
  code: string;
  description: {
    en: string;
    ar: string;
  };
  mainImage: string[];
  status: string;
  parentCategory: string;
  _id: string;
}

const subCategorySchema = new Schema({
  name: localizedStringSchema,
  description: localizedStringSchema,
  mainImage: [imageSchema],
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  parentCategory: { type: Schema.Types.ObjectId, ref: "Category", required: true },
});

const SubCategory = mongoose.models.SubCategory || mongoose.model("SubCategory", subCategorySchema);

export default SubCategory;
