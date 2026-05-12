//used by mongodb to create the collection 
const {model}= require("mongoose");
const {HoldingsSchema}=require("../schemas/HoldingsSchema");
const HoldingsModel =new model("holding", HoldingsSchema); 
 //collection named as holding
module.exports={HoldingsModel};
/*
const mongoose = require("mongoose");
const { HoldingsSchema } = require("../schemas/HoldingsSchema");

const HoldingsModel = mongoose.model("holding", HoldingsSchema);

module.exports = { HoldingsModel };
*/
