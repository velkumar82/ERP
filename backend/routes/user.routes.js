const express = require("express");
const User = require("../models/User");

const router = express.Router();

/* ===============================
   CREATE USER
=============================== */
router.post("/create", async (req, res) => {
  try {
    const { userId, username, designation, department, email, role, password } = req.body;

    if (!userId || !username || !designation || !department || !role) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const existing = await User.findOne({ userId });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
      userId: userId.trim(),
      username: username.trim(),
      designation,
      department,
      email,
      role,
      password: password || userId + "@123"
    });

    await user.save();

    res.json({ message: "User created successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating user" });
  }
});

/* ===============================
   LOGIN ✅ FIXED
=============================== */
router.post("/login", async (req, res) => {
  try {
    const { userId, password } = req.body;

    if (!userId || !password) {
      return res.status(400).json({ message: "UserId & password required" });
    }

    const user = await User.findOne({ userId: userId.trim() });

    if (!user) {
      return res.status(401).json({ message: "Invalid User ID" });
    }

    // 🔑 Plain password check (NO bcrypt)
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.json({
      user: {
        userId: user.userId,
        username: user.username,
        role: user.role,
        department: user.department,
        designation: user.designation,
        clBalance: user.clBalance
      }
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ===============================
   GET USERS
=============================== */
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

module.exports = router;
