import mongoose from "mongoose";
import { ArabicEnglishSchema } from "./Home";
import { imageSchema } from "./Course";

const SectionSchema = new mongoose.Schema({
  title: ArabicEnglishSchema,
  desc: ArabicEnglishSchema,
  image: imageSchema,
  content: ArabicEnglishSchema,
  order: { type: Number, default: 0 },
  extraData: { type: mongoose.Schema.Types.Mixed },
});
const MetaDataSchema = new mongoose.Schema({
  metaTitle: ArabicEnglishSchema,
  metaDescription: ArabicEnglishSchema,
  metaKeywords: { type: [String], default: [] },
  socialImage: imageSchema,
});

const PageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    type: { type: String, default: "custom" },
    mainCover: imageSchema,
    sections: [SectionSchema],
    metadata: MetaDataSchema,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    isPublished: { type: Boolean, default: false },
    settings: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default mongoose.models.Page || mongoose.model("Page", PageSchema);
