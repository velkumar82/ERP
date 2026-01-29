const express = require("express");
const User = require("../models/User");

const router = express.Router();

/* ===== CREATE FACULTY USER (ADMIN) ===== */
router.post("/create-faculty", async (req, res) => {
  try {
    const {
      userId,
      name,
      department,
      email,
      mobile
    } = req.body;

    const exists = await User.findOne({ userId });
    if (exists) {
      return res.status(400).json({ message: "Faculty ID already exists" });
    }

    const user = new User({
      userId,
      name,
      department,
      email,
      mobile,
      role: "Faculty",
      password: userId + "@123"   // default password
    });

    await user.save();

    res.json({
      message: "Faculty user created successfully",
      defaultPassword: user.password
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===== GET ALL FACULTY (ADMIN) ===== */
router.get("/faculty", async (req, res) => {
  const users = await User.find({ role: "Faculty" });
  res.json(users);
});

module.exports = router;
