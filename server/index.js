import "dotenv/config";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, "../dist");

import authRoutes        from "./routes/auth.js";
import vehicleRoutes     from "./routes/vehicles.js";
import driverRoutes      from "./routes/drivers.js";
import tripRoutes        from "./routes/trips.js";
import maintenanceRoutes from "./routes/maintenance.js";
import fuelRoutes        from "./routes/fuel.js";
import fleetRoutes       from "./routes/fleet.js";
import externalRoutes    from "./routes/external.js";
import User              from "./models/User.js";
import { seedData }      from "./seed.js";

const app  = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/fleetflow";

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth",        authRoutes);
app.use("/api/vehicles",    vehicleRoutes);
app.use("/api/drivers",     driverRoutes);
app.use("/api/trips",       tripRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/fuel",        fuelRoutes);
app.use("/api/fleet",       fleetRoutes);
app.use("/api/external",    externalRoutes);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.json({
    status: "ok",
    database: isDbConnected ? "connected" : "disconnected",
    dbState: mongoose.connection.readyState,
    time: new Date().toISOString()
  });
});

// ─── Serve Frontend (Production / Monolithic mode) ────────────────────────────
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// ─── 404 handler ──────────────────────────────────────────────────────────────
app.use("/api/*", (req, res) => res.status(404).json({ message: "API route not found" }));
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// ─── Error handler ────────────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error("Server error:", err.stack || err.message);
  res.status(500).json({ message: err.message || "Internal server error" });
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});

// ─── Connect DB & start ───────────────────────────────────────────────────────
async function startServer() {
  try {
    console.log(`Connecting to MongoDB at ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log("[FleetFlow] MongoDB connected successfully.");

    // Check if initial users exist, if not, automatically seed
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log("[FleetFlow] Database is empty. Auto-seeding initial users and fleet data...");
      await seedData();
    }
  } catch (err) {
    console.warn("[FleetFlow] MongoDB connection warning:", err.message);
    console.warn("[FleetFlow] Make sure MongoDB is installed and running locally, or set MONGO_URI in server/.env");
    console.warn("[FleetFlow] Server will continue to listen on port", PORT);
  }

  if (!process.env.JWT_SECRET) {
    console.warn("[FleetFlow Security] Note: JWT_SECRET is not set in environment variables. Using development fallback.");
  }

  const server = app.listen(PORT, () => {
    console.log(`[FleetFlow] API running on http://localhost:${PORT}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`\n[FleetFlow] Error: Port ${PORT} is already in use by another running instance.`);
      console.error(`[FleetFlow] Stop the other process or set a different PORT in server/.env.\n`);
      process.exit(1);
    } else {
      console.error("Server listen error:", err);
      process.exit(1);
    }
  });
}

startServer();
