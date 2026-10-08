import express from "express";
import Vehicle from "../models/Vehicle.js";
import { auth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// GET /api/vehicles — all authenticated users
router.get("/", auth, async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/vehicles/:id
router.get("/:id", auth, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/vehicles — Manager only
router.post("/", auth, requireRole("Manager"), async (req, res) => {
  try {
    const { model_name, license_plate, max_capacity_kg, odometer, status } = req.body;
    if (!model_name || !license_plate || max_capacity_kg == null || odometer == null) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const vehicle = await Vehicle.create({ model_name, license_plate, max_capacity_kg, odometer, status: status || "Available" });
    res.status(201).json(vehicle);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: "License plate already exists" });
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/vehicles/:id — Manager only
router.put("/:id", auth, requireRole("Manager"), async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/vehicles/:id — Manager only
router.delete("/:id", auth, requireRole("Manager"), async (req, res) => {
  try {
    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ message: "Vehicle deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
