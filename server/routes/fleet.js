import express from "express";
import Vehicle from "../models/Vehicle.js";
import Driver from "../models/Driver.js";
import Trip from "../models/Trip.js";
import Maintenance from "../models/Maintenance.js";
import Fuel from "../models/Fuel.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// GET /api/fleet/data — returns all fleet data for Intelligence Hub
router.get("/data", auth, async (req, res) => {
  try {
    const [vehicles, drivers, trips, maintenance, fuel] = await Promise.all([
      Vehicle.find().sort({ createdAt: -1 }),
      Driver.find().sort({ createdAt: -1 }),
      Trip.find()
        .populate("vehicle_id", "license_plate model_name max_capacity_kg status")
        .populate("driver_id", "name license_number license_expiry_date status safety_score")
        .sort({ createdAt: -1 }),
      Maintenance.find()
        .populate("vehicle_id", "license_plate model_name")
        .sort({ date: -1 }),
      Fuel.find()
        .populate("vehicle_id", "license_plate model_name")
        .sort({ date: -1 }),
    ]);
    res.json({ vehicles, drivers, trips, maintenance, fuel });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/fleet/stats — quick summary stats for dashboard
router.get("/stats", auth, async (req, res) => {
  try {
    const [vehicles, drivers, trips, maintenance, fuel] = await Promise.all([
      Vehicle.find(),
      Driver.find(),
      Trip.find(),
      Maintenance.find(),
      Fuel.find(),
    ]);

    const activeFleet   = vehicles.filter(v => v.status === "On Trip").length;
    const inMaintenance = vehicles.filter(v => v.status === "In Shop").length;
    const available     = vehicles.filter(v => v.status === "Available").length;
    const pendingTrips  = trips.filter(t => t.status === "Draft").length;
    const expiredLicenses = drivers.filter(d => new Date(d.license_expiry_date) < new Date()).length;
    const avgSafetyScore  = drivers.length
      ? (drivers.reduce((s, d) => s + (d.safety_score || 0), 0) / drivers.length).toFixed(1)
      : 0;
    const totalMaintCost = maintenance.reduce((s, m) => s + Number(m.cost), 0);
    const totalFuelCost  = fuel.reduce((s, f) => s + Number(f.cost), 0);

    res.json({
      activeFleet,
      inMaintenance,
      available,
      pendingTrips,
      expiredLicenses,
      avgSafetyScore: Number(avgSafetyScore),
      totalOperationalCost: totalMaintCost + totalFuelCost,
      totalMaintCost,
      totalFuelCost,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
