import express from "express";
import Trip from "../models/Trip.js";
import Vehicle from "../models/Vehicle.js";
import Driver from "../models/Driver.js";
import { auth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// GET /api/trips — all authenticated users
router.get("/", auth, async (req, res) => {
  try {
    const trips = await Trip.find()
      .populate("vehicle_id", "license_plate model_name max_capacity_kg status")
      .populate("driver_id", "name license_number license_expiry_date status safety_score")
      .sort({ createdAt: -1 });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/trips/:id
router.get("/:id", auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate("vehicle_id")
      .populate("driver_id");
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/trips — Dispatcher or Manager
router.post("/", auth, requireRole("Manager", "Dispatcher"), async (req, res) => {
  try {
    const { vehicle_id, driver_id, cargo_weight, origin, destination, status } = req.body;
    if (!vehicle_id || !driver_id || cargo_weight == null || !origin || !destination) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Business rule validations
    const vehicle = await Vehicle.findById(vehicle_id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    if (vehicle.status === "In Shop") return res.status(400).json({ message: "Vehicle is in maintenance" });
    if (Number(cargo_weight) > vehicle.max_capacity_kg) {
      return res.status(400).json({ message: `Cargo exceeds vehicle capacity (${vehicle.max_capacity_kg} kg)` });
    }

    const driver = await Driver.findById(driver_id);
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    if (driver.status === "Suspended") return res.status(400).json({ message: "Suspended driver cannot be assigned" });
    if (new Date(driver.license_expiry_date) < new Date()) return res.status(400).json({ message: "Driver license is expired" });

    const tripStatus = status || "Draft";
    const trip = await Trip.create({ vehicle_id, driver_id, cargo_weight: Number(cargo_weight), origin, destination, status: tripStatus });

    // If dispatched, update vehicle status
    if (tripStatus === "Dispatched") {
      await Vehicle.findByIdAndUpdate(vehicle_id, { status: "On Trip" });
    }

    const populated = await trip.populate([
      { path: "vehicle_id", select: "license_plate model_name max_capacity_kg status" },
      { path: "driver_id",  select: "name license_number license_expiry_date status safety_score" },
    ]);
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/trips/:id/status — update trip status
router.patch("/:id/status", auth, requireRole("Manager", "Dispatcher"), async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["Draft", "Dispatched", "Completed", "Cancelled"];
    if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });

    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const oldStatus = trip.status;
    trip.status = status;
    await trip.save();

    // Update vehicle status based on trip status transitions
    if (status === "Dispatched" && oldStatus !== "Dispatched") {
      await Vehicle.findByIdAndUpdate(trip.vehicle_id, { status: "On Trip" });
    } else if ((status === "Completed" || status === "Cancelled") && oldStatus === "Dispatched") {
      const vehicle = await Vehicle.findById(trip.vehicle_id);
      if (vehicle && vehicle.status === "On Trip") {
        await Vehicle.findByIdAndUpdate(trip.vehicle_id, { status: "Available" });
      }
    }

    const populated = await trip.populate([
      { path: "vehicle_id", select: "license_plate model_name max_capacity_kg status" },
      { path: "driver_id",  select: "name license_number license_expiry_date status safety_score" },
    ]);
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/trips/:id — Manager only
router.delete("/:id", auth, requireRole("Manager"), async (req, res) => {
  try {
    await Trip.findByIdAndDelete(req.params.id);
    res.json({ message: "Trip deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
