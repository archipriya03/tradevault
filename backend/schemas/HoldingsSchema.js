const mongoose = require("mongoose");  // full import
const HoldingsSchema = new mongoose.Schema({
    name:String,
    qty:Number,
    avg:Number,
    price:Number,
    net:String,
    day:String,
    userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
},
});
module.exports={HoldingsSchema};