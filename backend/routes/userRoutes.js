// Zerodha version of your RBAC userRoutes.js
// Uses your exact same pattern: verifyToken + authorizeRoles("role1","role2")
const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const router = express.Router();

// ── Role check routes (same pattern as your RBAC) ──────────────────────────

// Only admin can access
router.get("/admin", verifyToken, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Welcome admin" });
});

// Admin and manager can access
router.get("/manager", verifyToken, authorizeRoles("admin", "manager"), (req, res) => {
  res.json({ message: "Welcome manager" });
});

// All roles can access
router.get("/user", verifyToken, authorizeRoles("admin", "manager", "user"), (req, res) => {
  res.json({ message: "Welcome user" });
});

// ── Zerodha-specific protected routes ─────────────────────────────────────

// GET /api/users/me — logged-in user's own profile
// All roles allowed
router.get(
  "/me",
  verifyToken,
  authorizeRoles("admin", "manager", "user"),
  async (req, res) => {
    try {
      const User = require("../model/userModel");
      const user = await User.findById(req.user.id).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json({ user });
    } catch (err) {
  console.log("ME ERROR:", err.message);
  res.status(500).json({ message: err.message });
    }
  }
);

// GET /api/users/all — admin only: see all registered users
router.get(
  "/all",
  verifyToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const User = require("../model/userModel");
      const users = await User.find().select("-password");
      res.json({ count: users.length, users });
    } catch (err) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

// PATCH /api/users/:id/role — admin only: change a user's role
router.patch(
  "/:id/role",
  verifyToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const User = require("../model/userModel");
      const { role } = req.body;
      if (!["admin", "manager", "user"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true }
      ).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json({ message: `Role updated to ${role}`, user });
    } catch (err) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

module.exports = router;