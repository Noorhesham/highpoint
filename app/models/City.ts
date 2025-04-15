import mongoose, { Schema } from "mongoose";
import { localizedStringSchema } from "./Course";
export interface CityProps {
  name: { en: string; ar: string };
  image: { secure_url: string; public_id: string }[];
  _id: string;
}
const imageSchema = new Schema({
  secure_url: { type: String, required: true },
  public_id: { type: String, required: true },
});
const citySchema = new Schema({
  name: localizedStringSchema,
  image: imageSchema,
});

const City = mongoose.models.City || mongoose.model("City", citySchema);

export default City;
