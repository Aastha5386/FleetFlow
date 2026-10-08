import mongoose from "mongoose";

const fuelSchema = new mongoose.Schema({
  vehicle_id: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
  liters:     { type: Number, required: true, min: 0 },
  cost:       { type: Number, required: true, min: 0 },
  date:       { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Fuel", fuelSchema);
