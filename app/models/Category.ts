import mongoose, { Schema } from "mongoose";
import { imageSchema, localizedStringSchema } from "./Course";
import { SubCategoryProps } from "./SubCategory";
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
  mainImage: { secure_url: string; public_id: string }[];
  status: string;
  _id: string;
  subCategories: SubCategoryProps[];
}
const categorySchema = new Schema(
  {
    name: localizedStringSchema,
    code: { type: String },
    description: localizedStringSchema,
    mainImage: [imageSchema],
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    // subCategories: [{ type: Schema.Types.ObjectId, ref: "SubCategory" }],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
categorySchema.virtual("subCategories", {
  ref: "SubCategory",
  localField: "_id",
  foreignField: "parentCategory",
});
categorySchema.pre("find", function (this) {
  this.populate("subCategories");
});
const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
export default Category;
