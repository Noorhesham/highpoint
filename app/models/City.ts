import mongoose, { Schema } from "mongoose";
import { localizedStringSchema } from "./Course";
export interface CityProps {
  name: string;
  code: string;
  images: string[];
  hotelName: string;
  hotelLink: string;
  priceForweek: number;
  priceFor2weeks: number;
}
const imageSchema = new Schema({
  secure_url: { type: String, required: true },
  public_id: { type: String, required: true },
});
const citySchema = new Schema({
  name: localizedStringSchema,
  code: { type: String },
  images: [imageSchema],
  hotelName: { type: String },
  hotelLink: { type: String },
  priceForweek: { type: Number },
  priceFor2weeks: { type: Number },
});

const City = mongoose.models.city || mongoose.model("City", citySchema);
export default City;
