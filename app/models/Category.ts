import mongoose, { Schema } from "mongoose";
import { imageSchema, localizedStringSchema } from "./Course";
export interface CategoryProps {
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
  _id: string;
}
const categorySchema = new Schema({
  name: localizedStringSchema,
  code: { type: String },
  description: localizedStringSchema,
  mainImage: [imageSchema],
  status: { type: String, enum: ["active", "inactive"], default: "active" },
});

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
export default Category;
