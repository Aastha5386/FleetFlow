import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
  vehicle_id:   { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
  driver_id:    { type: mongoose.Schema.Types.ObjectId, ref: "Driver",  required: true },
  cargo_weight: { type: Number, required: true, min: 0 },
  origin:       { type: String, required: true, trim: true },
  destination:  { type: String, required: true, trim: true },
  status:       { type: String, enum: ["Draft", "Dispatched", "Completed", "Cancelled"], default: "Draft" },
}, { timestamps: true });

export default mongoose.model("Trip", tripSchema);
