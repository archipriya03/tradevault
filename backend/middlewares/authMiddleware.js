// Your RBAC authMiddleware.js — copied as-is, zero changes needed
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // has { id, role } — same as your RBAC
    console.log("Decoded user:", req.user);
    next();
  } catch (err) {
    return res.status(400).json({ message: "Token is not valid" });
  }
};

module.exports = verifyToken;