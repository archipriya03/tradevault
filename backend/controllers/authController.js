const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel"); // ✅ matches your actual folder name

// REGISTER — adapted from your RBAC register()
// Changed: username → name + email (Zerodha uses email login)
// Role defaults to "user" — never let users self-assign "admin"
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if email already taken
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "Account already exists with this email" });
    }

    // Hash password — same as your RBAC (bcrypt, salt 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "user", // always "user" on signup — admin assigned manually in DB
    });
    await newUser.save();

    res.status(201).json({ message: `User registered with email ${email}` });
  }  catch (err) {
  console.log("ERROR:", err.message);
  res.status(500).json({ message: err.message });
}
};

// LOGIN — adapted from your RBAC login()
// Changed: find by email instead of username
// Token payload includes { id, role } — same as your RBAC
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: `User with email ${email} not found` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Token payload: { id, role } — exactly like your RBAC
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // same as your RBAC
    );

    // Also return user info so frontend can display name/role
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        virtualBalance: user.virtualBalance,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { register, login };