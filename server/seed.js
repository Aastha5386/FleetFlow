/**
 * Seed script — populates MongoDB with initial role users and demo fleet data:
 *   node seed.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Vehicle from "./models/Vehicle.js";
import Driver from "./models/Driver.js";
import Trip from "./models/Trip.js";
import Maintenance from "./models/Maintenance.js";
import Fuel from "./models/Fuel.js";

export async function seedData() {
  try {
    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Vehicle.deleteMany({}),
      Driver.deleteMany({}),
      Trip.deleteMany({}),
      Maintenance.deleteMany({}),
      Fuel.deleteMany({}),
    ]);
    console.log("Cleared existing data");

    // ── Vehicles ───────────────────────────────────────────────────────────
    const vehicles = await Vehicle.insertMany([
      { model_name: "Tata Ace Gold",         license_plate: "DL-01-AB-1001", max_capacity_kg: 750,  odometer: 42000,  status: "On Trip"   },
      { model_name: "Eicher Pro 2049",        license_plate: "DL-01-AB-1002", max_capacity_kg: 4800, odometer: 96500,  status: "On Trip"   },
      { model_name: "Mahindra Bolero Pickup", license_plate: "DL-01-AB-1003", max_capacity_kg: 1000, odometer: 61000,  status: "Available" },
      { model_name: "Ashok Leyland Dost",     license_plate: "DL-01-AB-1004", max_capacity_kg: 1500, odometer: 128000, status: "In Shop"   },
      { model_name: "Tata 407",               license_plate: "DL-01-AB-1005", max_capacity_kg: 2500, odometer: 153000, status: "Available" },
    ]);
    console.log(`Created ${vehicles.length} vehicles`);

    // ── Drivers ────────────────────────────────────────────────────────────
    const drivers = await Driver.insertMany([
      { name: "Ravi Kumar",   license_number: "DL-2019-101", license_expiry_date: "2027-11-09", status: "On Trip",   safety_score: 88 },
      { name: "Suresh Singh", license_number: "DL-2018-202", license_expiry_date: "2026-10-24", status: "On Trip",   safety_score: 64 },
      { name: "Amit Verma",   license_number: "DL-2020-303", license_expiry_date: "2028-06-01", status: "Available", safety_score: 91 },
      { name: "Deepak Yadav", license_number: "DL-2017-404", license_expiry_date: "2026-09-19", status: "Suspended", safety_score: 42 },
      { name: "Mohit Sharma", license_number: "DL-2021-505", license_expiry_date: "2028-11-24", status: "Available", safety_score: 79 },
    ]);
    console.log(`Created ${drivers.length} drivers`);

    // ── Users for all roles ────────────────────────────────────────────────
    const pwManager    = await bcrypt.hash("manager123", 10);
    const pwDriver     = await bcrypt.hash("driver123", 10);
    const pwSafety     = await bcrypt.hash("safety123", 10);
    const pwDispatcher = await bcrypt.hash("dispatcher123", 10);
    const pwFinance    = await bcrypt.hash("finance123", 10);

    const users = await User.insertMany([
      {
        username: "manager",
        name:     "Fleet Manager",
        email:    "manager@fleetflow.local",
        password: pwManager,
        role:     "Manager",
        status:   "approved",
      },
      {
        username: "driver",
        name:     "Ravi Kumar",
        email:    "ravi.driver@fleetflow.local",
        password: pwDriver,
        role:     "Driver",
        status:   "approved",
        driver_id: drivers[0]._id,
      },
      {
        username: "safety",
        name:     "Sarah Connor",
        email:    "safety@fleetflow.local",
        password: pwSafety,
        role:     "Safety Officer",
        status:   "approved",
      },
      {
        username: "dispatcher",
        name:     "Dave Clark",
        email:    "dispatcher@fleetflow.local",
        password: pwDispatcher,
        role:     "Dispatcher",
        status:   "approved",
      },
      {
        username: "finance",
        name:     "Fiona Banks",
        email:    "finance@fleetflow.local",
        password: pwFinance,
        role:     "Financial Analyst",
        status:   "approved",
      },
    ]);
    console.log(`Created ${users.length} authenticated users with role access`);

    // ── Trips ──────────────────────────────────────────────────────────────
    const trips = await Trip.insertMany([
      { vehicle_id: vehicles[0]._id, driver_id: drivers[0]._id, cargo_weight: 600,  origin: "Delhi",     destination: "Jaipur",    status: "Dispatched" },
      { vehicle_id: vehicles[1]._id, driver_id: drivers[1]._id, cargo_weight: 4200, origin: "Mumbai",    destination: "Pune",      status: "Dispatched" },
      { vehicle_id: vehicles[2]._id, driver_id: drivers[2]._id, cargo_weight: 850,  origin: "Gurgaon",   destination: "Agra",      status: "Draft"      },
      { vehicle_id: vehicles[0]._id, driver_id: drivers[0]._id, cargo_weight: 700,  origin: "Delhi",     destination: "Lucknow",   status: "Completed"  },
      { vehicle_id: vehicles[4]._id, driver_id: drivers[4]._id, cargo_weight: 2300, origin: "Noida",     destination: "Kanpur",    status: "Completed"  },
      { vehicle_id: vehicles[3]._id, driver_id: drivers[3]._id, cargo_weight: 1400, origin: "Faridabad", destination: "Chandigarh",status: "Cancelled"  },
    ]);
    console.log(`Created ${trips.length} trips`);

    // ── Maintenance ────────────────────────────────────────────────────────
    const maintenance = await Maintenance.insertMany([
      { vehicle_id: vehicles[3]._id, description: "Engine overhaul",        cost: 28000, date: "2026-10-02" },
      { vehicle_id: vehicles[1]._id, description: "Brake pad replacement",  cost: 6400,  date: "2026-09-24" },
      { vehicle_id: vehicles[0]._id, description: "Oil change",             cost: 3200,  date: "2026-09-14" },
      { vehicle_id: vehicles[4]._id, description: "Tyre rotation",          cost: 1800,  date: "2026-08-20" },
      { vehicle_id: vehicles[2]._id, description: "AC service",             cost: 4500,  date: "2026-07-21" },
    ]);
    console.log(`Created ${maintenance.length} maintenance logs`);

    // ── Fuel ───────────────────────────────────────────────────────────────
    const fuel = await Fuel.insertMany([
      { vehicle_id: vehicles[0]._id, liters: 28.5,  cost: 2720,  date: "2026-10-03" },
      { vehicle_id: vehicles[1]._id, liters: 145.0, cost: 13800, date: "2026-10-02" },
      { vehicle_id: vehicles[2]._id, liters: 34.0,  cost: 3200,  date: "2026-09-30" },
      { vehicle_id: vehicles[4]._id, liters: 68.0,  cost: 6450,  date: "2026-09-28" },
      { vehicle_id: vehicles[0]._id, liters: 25.0,  cost: 2380,  date: "2026-09-26" },
      { vehicle_id: vehicles[3]._id, liters: 30.0,  cost: 2850,  date: "2026-09-22" },
    ]);
    console.log(`Created ${fuel.length} fuel logs`);

    console.log("\n✅  Seed complete!");
    console.log("   Credentials:");
    console.log("   - Manager:            username: manager    password: manager123");
    console.log("   - Driver:             username: driver     password: driver123");
    console.log("   - Safety Officer:     username: safety     password: safety123");
    console.log("   - Dispatcher:         username: dispatcher password: dispatcher123");
    console.log("   - Financial Analyst:  username: finance    password: finance123");
  } catch (err) {
    console.error("Seed failed:", err);
  }
}

// If run directly: node seed.js
if (process.argv[1]?.endsWith("seed.js")) {
  mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/fleetflow")
    .then(async () => {
      console.log("Connected to MongoDB for seeding");
      await seedData();
      await mongoose.disconnect();
    })
    .catch((err) => {
      console.error("MongoDB seed connection error:", err.message);
    });
}
