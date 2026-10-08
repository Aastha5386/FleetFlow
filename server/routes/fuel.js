import express from "express";
import Fuel from "../models/Fuel.js";
import { auth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// GET /api/fuel
router.get("/", auth, async (req, res) => {
  try {
    const logs = await Fuel.find()
      .populate("vehicle_id", "license_plate model_name")
      .sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/fuel — Financial Analyst or Manager
router.post("/", auth, requireRole("Manager", "Financial Analyst"), async (req, res) => {
  try {
    const { vehicle_id, liters, cost, date } = req.body;
    if (!vehicle_id || liters == null || cost == null || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const log = await Fuel.create({ vehicle_id, liters: Number(liters), cost: Number(cost), date });
    const populated = await log.populate("vehicle_id", "license_plate model_name");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/fuel/:id — Manager only
router.delete("/:id", auth, requireRole("Manager"), async (req, res) => {
  try {
    await Fuel.findByIdAndDelete(req.params.id);
    res.json({ message: "Fuel log deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
