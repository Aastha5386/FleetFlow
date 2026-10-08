import express from "express";
import Driver from "../models/Driver.js";
import { auth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// GET /api/drivers — all authenticated users
router.get("/", auth, async (req, res) => {
  try {
    const drivers = await Driver.find().sort({ createdAt: -1 });
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/drivers/:id
router.get("/:id", auth, async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    res.json(driver);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/drivers — Manager only
router.post("/", auth, requireRole("Manager"), async (req, res) => {
  try {
    const { name, license_number, license_expiry_date, status, safety_score } = req.body;
    if (!name || !license_number || !license_expiry_date) {
      return res.status(400).json({ message: "Name, license number, and expiry date are required" });
    }
    const driver = await Driver.create({ name, license_number, license_expiry_date, status: status || "Available", safety_score: safety_score ?? 75 });
    res.status(201).json(driver);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: "License number already exists" });
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/drivers/:id — Manager or Safety Officer
router.put("/:id", auth, requireRole("Manager", "Safety Officer"), async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    res.json(driver);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/drivers/:id/safety — Safety Officer updates safety_score and status
router.patch("/:id/safety", auth, requireRole("Manager", "Safety Officer"), async (req, res) => {
  try {
    const { safety_score, status } = req.body;
    const driver = await Driver.findByIdAndUpdate(req.params.id, { safety_score, status }, { new: true, runValidators: true });
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    res.json(driver);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/drivers/:id — Manager only
router.delete("/:id", auth, requireRole("Manager"), async (req, res) => {
  try {
    await Driver.findByIdAndDelete(req.params.id);
    res.json({ message: "Driver deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
