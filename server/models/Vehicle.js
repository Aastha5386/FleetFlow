import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  model_name:      { type: String, required: true, trim: true },
  license_plate:   { type: String, required: true, unique: true, trim: true },
  max_capacity_kg: { type: Number, required: true, min: 0 },
  odometer:        { type: Number, required: true, min: 0 },
  status:          { type: String, enum: ["Available", "On Trip", "In Shop"], default: "Available" },
}, { timestamps: true });

export default mongoose.model("Vehicle", vehicleSchema);
