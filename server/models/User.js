import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  role:     { 
    type: String, 
    enum: ["Manager", "Dispatcher", "Safety Officer", "Financial Analyst", "Driver"], 
    required: true 
  },
  status:   { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  driver_id: { type: mongoose.Schema.Types.ObjectId, ref: "Driver", default: null },
  phone:     { type: String, default: "" },
  department:{ type: String, default: "Fleet Operations" },
  settings:  {
    type: Object,
    default: {
      speed_unit: "km/h",
      distance_unit: "km",
      currency: "INR",
      email_alerts: true,
      telemetry_sound: false,
      auto_refresh_sec: 30,
    },
  },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
