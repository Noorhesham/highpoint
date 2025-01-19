import mongoose, { Schema } from "mongoose";
export interface OperationProps {
  serialNumber: number;
  startDate: Date;
  endDate: Date;
  city: Schema.Types.ObjectId;
  _id: string;
  duration: number;
  price: number;
  course: { type: Schema.Types.ObjectId; ref: "Course"; required: true };
}
const operationSchema = new Schema<OperationProps>({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  city: { type: Schema.Types.ObjectId, ref: "City", required: true },
  price: { type: Number, required: true },
  course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
});
operationSchema.pre("findOne", function (this) {
  this.populate("city");
});
const Operation = mongoose.models.Operation || mongoose.model("Operation", operationSchema);

export default Operation;
