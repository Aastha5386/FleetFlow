import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { auth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// POST /api/auth/register — public, creates a user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, username } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const cleanRole = role === "Fleet Manager" ? "Manager" : role;
    const allowedRoles = ["Manager", "Dispatcher", "Safety Officer", "Financial Analyst", "Driver"];
    if (!allowedRoles.includes(cleanRole)) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = (typeof password === "string" ? password : String(password)).trim();
    if (cleanPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email: cleanEmail });
    if (existingEmail) {
      return res.status(400).json({
        message: "An account with this email already exists. Please sign in instead.",
      });
    }

    // Resolve username collision gracefully so users never get blocked by seed user collisions
    let baseUsername = (username || cleanEmail.split("@")[0]).trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
    if (!baseUsername) baseUsername = "user";
    let finalUsername = baseUsername;
    let collision = await User.findOne({ username: finalUsername });
    let suffix = 1;
    while (collision) {
      finalUsername = `${baseUsername}_${suffix++}`;
      collision = await User.findOne({ username: finalUsername });
    }

    const hashed = await bcrypt.hash(cleanPassword, 10);
    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashed,
      role: cleanRole,
      username: finalUsername,
      status: "approved",
    });

    // Generate JWT token so user can be immediately authenticated
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role, name: user.name, email: user.email, driver_id: user.driver_id },
      process.env.JWT_SECRET || "fleetflow_dev_local_secret",
      { expiresIn: "12h" }
    );

    res.status(201).json({
      message: "Account created successfully!",
      token,
      user: {
        id: user._id,
        _id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        driver_id: user.driver_id,
        settings: user.settings,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login — public
router.post("/login", async (req, res) => {
  try {
    const { username, password, email, emailOrUser } = req.body;
    const identifier = (username || email || emailOrUser || req.body.login || "").trim();
    const rawPass = password != null ? String(password) : "";
    const cleanPass = rawPass.trim();

    if (!identifier || !cleanPass) {
      return res.status(400).json({ message: "Email or username and password are required" });
    }

    // Allow login by email OR username (case-insensitive and trimmed)
    const norm = identifier;
    const normLower = identifier.toLowerCase();
    const user = await User.findOne({
      $or: [
        { email: normLower },
        { username: normLower },
        { email: norm },
        { username: norm },
      ],
    });

    if (!user) {
      return res.status(401).json({
        message: `No account found with "${identifier}". Please check your email or sign up.`,
      });
    }

    // Resilient password matching
    let valid = await bcrypt.compare(cleanPass, user.password);
    if (!valid && rawPass !== cleanPass) {
      valid = await bcrypt.compare(rawPass, user.password);
    }
    // Also support plain-text comparison for fallback/legacy seeded accounts
    if (!valid && (user.password === cleanPass || user.password === rawPass)) {
      valid = true;
      user.password = await bcrypt.hash(cleanPass, 10);
      await user.save();
    }

    if (!valid) {
      return res.status(401).json({
        message: "Incorrect password. Please verify and try again.",
      });
    }

    // Auto-approve account if it was previously marked pending
    if (user.status !== "approved") {
      user.status = "approved";
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role, name: user.name, email: user.email, driver_id: user.driver_id },
      process.env.JWT_SECRET || "fleetflow_dev_local_secret",
      { expiresIn: "12h" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        _id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        driver_id: user.driver_id,
        settings: user.settings,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/reset-password — Self-service password reset
router.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required" });
    }
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = (typeof newPassword === "string" ? newPassword : String(newPassword)).trim();
    if (cleanPass.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters long" });
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ message: `No account found with email "${cleanEmail}"` });
    }

    user.password = await bcrypt.hash(cleanPass, 10);
    user.status = "approved";
    await user.save();

    res.json({ message: "Password reset successfully! You can now log in with your new password." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/google — Google OAuth sign-in
router.post("/google", async (req, res) => {
  try {
    const { email, name, role = "Manager" } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Google account email is required" });
    }

    const cleanEmail = email.trim().toLowerCase();
    let user = await User.findOne({ email: cleanEmail });

    if (!user) {
      // Auto-provision verified Google user
      const username = cleanEmail.split("@")[0].replace(/[^a-zA-Z0-9]/g, "_");
      const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);
      user = await User.create({
        username,
        name: name || cleanEmail.split("@")[0],
        email: cleanEmail,
        password: randomPassword,
        role: role,
        status: "approved",
      });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role, name: user.name, email: user.email, driver_id: user.driver_id },
      process.env.JWT_SECRET || "fleetflow_dev_local_secret",
      { expiresIn: "12h" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        _id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        driver_id: user.driver_id,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me — get current user from token
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/users — Manager only: list all non-manager users
router.get("/users", auth, requireRole("Manager"), async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "Manager" } }).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/auth/users/:id/approve — Manager only
router.patch("/users/:id/approve", auth, requireRole("Manager"), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/auth/users/:id/reject — Manager only
router.patch("/users/:id/reject", auth, requireRole("Manager"), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: "rejected" }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/auth/users/:id — Manager only
router.delete("/users/:id", auth, requireRole("Manager"), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/auth/profile — Update user's profile info and password
router.patch("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, email, phone, department, currentPassword, newPassword } = req.body;

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (department !== undefined) user.department = department.trim();

    if (email && email.trim().toLowerCase() !== user.email) {
      const cleanEmail = email.trim().toLowerCase();
      const duplicate = await User.findOne({ email: cleanEmail, _id: { $ne: user._id } });
      if (duplicate) {
        return res.status(400).json({ message: "Email is already taken by another account" });
      }
      user.email = cleanEmail;
    }

    // Password change (optional)
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required to set a new password" });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters" });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    // Re-issue fresh JWT token with updated identity
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role, name: user.name, email: user.email, driver_id: user.driver_id },
      process.env.JWT_SECRET || "fleetflow_dev_local_secret",
      { expiresIn: "12h" }
    );

    const safeUser = user.toObject();
    delete safeUser.password;

    res.json({
      message: "Profile updated successfully!",
      token,
      user: safeUser,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/auth/settings — Update user preferences
router.patch("/settings", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.settings = { ...user.settings, ...req.body };
    user.markModified("settings");
    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;

    res.json({
      message: "Preferences updated successfully!",
      settings: user.settings,
      user: safeUser,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
