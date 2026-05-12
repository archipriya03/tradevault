const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const router = express.Router();

const { OrderModel } = require("../model/OrdersModel"); // ✅ fixed: model not models

// POST /api/orders — place a new order
router.post(
  "/",
  verifyToken,
  authorizeRoles("admin", "manager", "user"),
  async (req, res) => {
    try {
      const { name, qty, price, mode } = req.body;
      const newOrder = new OrderModel({
        name,
        qty,
        price,
        mode,
        userId: req.user.id,
      });
      await newOrder.save();
      res.status(201).json({ message: "Order placed", order: newOrder });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// GET /api/orders — user sees only their orders, admin sees all
router.get(
  "/",
  verifyToken,
  authorizeRoles("admin", "manager", "user"),
  async (req, res) => {
    try {
      const query =
        req.user.role === "admin"
          ? {}
          : { userId: req.user.id };

      const orders = await OrderModel.find(query);
      res.json({ orders });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// DELETE /api/orders/:id — admin only
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      await OrderModel.findByIdAndDelete(req.params.id);
      res.json({ message: "Order deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;