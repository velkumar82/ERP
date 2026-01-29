const express = require("express");
const User = require("../models/User");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { userId, password, role } = req.body;

  try {
    const user = await User.findOne({ userId, role });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.status !== "Active") {
      return res.status(403).json({ message: "User account disabled" });
    }

    res.json({
      message: "Login successful",
      user: {
        userId: user.userId,
        name: user.name,
        role: user.role,
        department: user.department
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
