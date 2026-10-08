import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
  name:                { type: String, required: true, trim: true },
  license_number:      { type: String, required: true, unique: true, trim: true },
  license_expiry_date: { type: String, required: true },
  status:              { type: String, enum: ["Available", "On Trip", "Suspended"], default: "Available" },
  safety_score:        { type: Number, default: 75, min: 0, max: 100 },
}, { timestamps: true });

export default mongoose.model("Driver", driverSchema);
