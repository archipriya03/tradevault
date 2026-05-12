const mongoose = require("mongoose");  // full import

const OrderSchema = new mongoose.Schema({
  name:  String,
  qty:   Number,
  price: Number,
  mode:  String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,  // ✅ works now
    ref: "User",
    required: true,
  },
});

module.exports = { OrderSchema };