import mongoose, { Schema } from "mongoose";
import { localizedStringSchema } from "./Course";
export interface OperationProps {
  serialNumber: number;
  startDate: Date;
  city: Schema.Types.ObjectId;
  duration: number;
  sale: number;
}
const operationSchema = new Schema<OperationProps>({
  serialNumber: { type: Number, required: true },
  startDate: { type: Date, required: true },
  city: { type: Schema.Types.ObjectId, ref: "City", required: true },
  duration: { type: Number, required: true },
  sale: { type: Number, required: true },
});

const Operation = mongoose.models.operation || mongoose.model("Operation", operationSchema);
export default Operation;
