import express from "express";
import Maintenance from "../models/Maintenance.js";
import Vehicle from "../models/Vehicle.js";
import { auth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// GET /api/maintenance
router.get("/", auth, async (req, res) => {
  try {
    const logs = await Maintenance.find()
      .populate("vehicle_id", "license_plate model_name status")
      .sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/maintenance — Manager only
router.post("/", auth, requireRole("Manager"), async (req, res) => {
  try {
    const { vehicle_id, description, cost, date } = req.body;
    if (!vehicle_id || !description || cost == null || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const log = await Maintenance.create({ vehicle_id, description, cost: Number(cost), date });
    // Mark vehicle as In Shop
    await Vehicle.findByIdAndUpdate(vehicle_id, { status: "In Shop" });
    const populated = await log.populate("vehicle_id", "license_plate model_name status");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/maintenance/:id — Manager only
router.delete("/:id", auth, requireRole("Manager"), async (req, res) => {
  try {
    await Maintenance.findByIdAndDelete(req.params.id);
    res.json({ message: "Maintenance log deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
