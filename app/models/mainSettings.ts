// models/GeneralConfig.ts
import mongoose, { Document, Schema, Model } from "mongoose";

export interface IGeneralConfig extends Document {
  appName: string;
  logo: string;
  theme: {
    primaryColor: string;
    secondaryColor?: string;
    fontFamily: string;
    pageMargin: number;
    pageBreakClassName: string;
  };
}

const GeneralConfigSchema: Schema<IGeneralConfig> = new Schema({
  appName: { type: String, required: true },
  logo: String,
  theme: {
    primaryColor: { type: String, required: true },
    secondaryColor: { type: String },
    fontFamily: { type: String, required: true },
    pageMargin: { type: Number, default: 10 },
    pageBreakClassName: { type: String, default: "page-break" },
  },
});

const GeneralConfig: Model<IGeneralConfig> =
  mongoose.models.GeneralConfig || mongoose.model<IGeneralConfig>("GeneralConfig", GeneralConfigSchema);

export default GeneralConfig;
