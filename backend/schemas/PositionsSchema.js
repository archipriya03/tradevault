const mongoose = require("mongoose");  // full import
const PositionsSchema=new mongoose.Schema({
    product:String,
    name:String,
    qty:Number,
    avg:Number,
    price:Number,
    net:String,
    day:String,
    isLoss:Boolean,
    userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
},
});
module.exports={PositionsSchema};