import mongoose from "mongoose";

const maintenanceSchema = new mongoose.Schema({
  vehicle_id:  { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
  description: { type: String, required: true, trim: true },
  cost:        { type: Number, required: true, min: 0 },
  date:        { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Maintenance", maintenanceSchema);
