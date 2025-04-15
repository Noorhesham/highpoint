import mongoose from "mongoose";
import { imageSchema } from "./Course";

export interface ArabicEnglish {
  ar: string;
  en: string;
}

export interface Company {
  image?: string;
  title: ArabicEnglish;
}

export interface Section {
  title: ArabicEnglish;
  desc: ArabicEnglish;
}

export interface WhoWeAre {
  title: ArabicEnglish;
  desc: ArabicEnglish;
}

export interface Partners {
  title: ArabicEnglish;
  desc: ArabicEnglish;
  images: string[];
}

export interface HomeProps {
  mainCover?: string;
  mainTitle: ArabicEnglish;
  mainDesc: ArabicEnglish;
  secondaryCover?: string;
  companies: Company[];
  sections: Section[];
  whoWeAre: WhoWeAre;
  partners: Partners;
}

export const ArabicEnglishSchema = new mongoose.Schema({
  ar: { type: String, required: true },
  en: { type: String, required: true },
});

const CompanySchema = new mongoose.Schema({
  image: imageSchema,
  title: ArabicEnglishSchema,
});

const SectionSchema = new mongoose.Schema({
  title: ArabicEnglishSchema,
  desc: ArabicEnglishSchema,
  image: imageSchema,
});

const HomePageSchema = new mongoose.Schema({
  mainCover: imageSchema,
  mainTitle: ArabicEnglishSchema,
  mainDesc: ArabicEnglishSchema,
  secondaryCover: imageSchema,
  companies: [CompanySchema],
  sections: [SectionSchema],
  whoWeAre: {
    title: ArabicEnglishSchema,
    desc: ArabicEnglishSchema,
  },
  partners: {
    title: ArabicEnglishSchema,
    desc: ArabicEnglishSchema,
    images: [imageSchema],
  },
});

export default mongoose.models.HomePage || mongoose.model("HomePage", HomePageSchema);
