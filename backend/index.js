require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;
const app = express();

app.use(cors({
  origin: [
    "https://tradevault-frontend-1nz2.onrender.com",
    "https://tradevault-dashboard.onrender.com",
    "http://localhost:3000",
    "http://localhost:3001"
  ]
}));

app.use(bodyParser.json());

// ── Models ──
const { HoldingsModel } = require('./model/HoldingsModles');
const { PositionsModel } = require('./model/PositionsModels');
const { OrderModel } = require('./model/OrdersModel');

// ── Auth + RBAC middleware ──
const verifyToken = require('./middlewares/authMiddleware');
const authorizeRoles = require('./middlewares/roleMiddleware');

// ── Auth routes ──
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const ordersRoutes = require('./routes/ordersRoutes');

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", ordersRoutes);

// ── Protected holdings route ──
// Each user sees only their own holdings (matched by userId)
// Admin sees all holdings
app.get("/allHoldings", verifyToken, authorizeRoles("admin", "manager", "user"), async (req, res) => {
  try {
    const query = req.user.role === "admin"
      ? {}                           // admin sees all
      : { userId: req.user.id };     // user sees only theirs

    const allHoldings = await HoldingsModel.find(query);
    res.json(allHoldings);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// ── Protected positions route ──
app.get("/allPositions", verifyToken, authorizeRoles("admin", "manager", "user"), async (req, res) => {
  try {
    const query = req.user.role === "admin"
      ? {}
      : { userId: req.user.id };

    const allPositions = await PositionsModel.find(query);
    res.json(allPositions);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// ── Place new order (old route kept for dashboard BuyAction component) ──
// Now saves userId from token
app.post('/newOrder', verifyToken, authorizeRoles("admin", "manager", "user"), async (req, res) => {
  try {
    let newOrder = new OrderModel({
      name: req.body.name,
      qty: req.body.qty,
      price: req.body.price,
      mode: req.body.mode,
      userId: req.user.id, // ← attach logged-in user
    });
    await newOrder.save();
    res.send("order saved");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/test", (req, res) => res.json({ message: "server works" }));

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  mongoose.connect(uri);
  console.log("DB connected");
});

/*
require('dotenv').config(); //env valur will go to the system process
const express= require("express");
const mongoose =require("mongoose");
const PORT=process.env.PORT|| 3002; //aws will give the port no where it is deployed
const uri=process.env.MONGO_URL; //taking db url
const app=express();
const bodyParser=require("body-parser");
const cors= require("cors");

const { HoldingsModel } = require('./model/HoldingsModles');
const { PositionsModel } = require('./model/PositionsModels');
const {OrderModel}=require('./model/OrdersModel');

app.use(cors());
app.use(bodyParser.json());


const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

//inserting dummy data to databse 
/*
app.get('/addHoldings',async(req,res)=>
{
    let tempHoldings=[
  {
    name: "BHARTIARTL",
    qty: 2,
    avg: 538.05,
    price: 541.15,
    net: "+0.58%",
    day: "+2.99%",
  },
  {
    name: "HDFCBANK",
    qty: 2,
    avg: 1383.4,
    price: 1522.35,
    net: "+10.04%",
    day: "+0.11%",
  },
  {
    name: "HINDUNILVR",
    qty: 1,
    avg: 2335.85,
    price: 2417.4,
    net: "+3.49%",
    day: "+0.21%",
  },
  {
    name: "INFY",
    qty: 1,
    avg: 1350.5,
    price: 1555.45,
    net: "+15.18%",
    day: "-1.60%",
    isLoss: true,
  },
  {
    name: "ITC",
    qty: 5,
    avg: 202.0,
    price: 207.9,
    net: "+2.92%",
    day: "+0.80%",
  },
  {
    name: "KPITTECH",
    qty: 5,
    avg: 250.3,
    price: 266.45,
    net: "+6.45%",
    day: "+3.54%",
  },
  {
    name: "M&M",
    qty: 2,
    avg: 809.9,
    price: 779.8,
    net: "-3.72%",
    day: "-0.01%",
    isLoss: true,
  },
  {
    name: "RELIANCE",
    qty: 1,
    avg: 2193.7,
    price: 2112.4,
    net: "-3.71%",
    day: "+1.44%",
  },
  {
    name: "SBIN",
    qty: 4,
    avg: 324.35,
    price: 430.2,
    net: "+32.63%",
    day: "-0.34%",
    isLoss: true,
  },
  {
    name: "SGBMAY29",
    qty: 2,
    avg: 4727.0,
    price: 4719.0,
    net: "-0.17%",
    day: "+0.15%",
  },
  {
    name: "TATAPOWER",
    qty: 5,
    avg: 104.2,
    price: 124.15,
    net: "+19.15%",
    day: "-0.24%",
    isLoss: true,
  },
  {
    name: "TCS",
    qty: 1,
    avg: 3041.7,
    price: 3194.8,
    net: "+5.03%",
    day: "-0.25%",
    isLoss: true,
  },
  {
    name: "WIPRO",
    qty: 4,
    avg: 489.3,
    price: 577.75,
    net: "+18.08%",
    day: "+0.32%",
  },
];
tempHoldings.forEach((item)=>
{
let newHolding = new HoldingsModel({
        name:item.name,
        qty:item.qty,
        avg:item.avg,
        price:item.price,
        net:item.net,
        day:item.day,
    });
    newHolding.save();
});
res.send("done");
});
*/

/*
app.get('/addPosition',async(req,res)=>
{
    let tempPosition=[
  {
    product: "CNC",
    name: "EVEREADY",
    qty: 2,
    avg: 316.27,
    price: 312.35,
    net: "+0.58%",
    day: "-1.24%",
    isLoss: true,
  },
  {
    product: "CNC",
    name: "JUBLFOOD",
    qty: 1,
    avg: 3124.75,
    price: 3082.65,
    net: "+10.04%",
    day: "-1.35%",
    isLoss: true,
  }
];
   tempPosition.forEach((item)=>
{
let newPosition = new PositionsModel({
        product: item.product,
        name: item.name,
        qty: item.qty,
        avg: item.avg,
        price: item.price,
        net: item.net,
        day: item.day,
        isLoss: item.isLoss,
    });
    newPosition.save();
});
res.send("done2");
});
*/
//position and holding data from database and watchlist data from api

//below both are the api end pointes which we will connect with the dashboard
//fetch / read holdings data from DB

/*
app.get("/allHoldings",async(rer,res)=>
{
let allHoldings = await HoldingsModel.find({});
res.json(allHoldings);
});

app.get("/allPositions",async(rer,res)=>
{
let allPositions = await PositionsModel.find({});
res.json(allPositions);
});
app.get("/test", (req, res) => res.json({ message: "server works" }));
//reading data from user to insert
app.post('/newOrder',async(req,res)=>
{
let newOrder=new OrderModel({
  name: req.body.name,
  qty:req.body.qty,
  price: req.body.price,
  mode:req.body.mode,
});
newOrder.save();
res.send("order saved");
});



app.listen (PORT,()=>
{
    console.log("app started");
    mongoose.connect(uri);
    console.log("db connected");
});

//most common error that occures while establishing connection to mongodb is INVALID CREDENTIALS (BADAUTH)bad authentication ->when password or url incorrect
*/