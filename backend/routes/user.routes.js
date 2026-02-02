const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/login", async (req, res) => {
  try {
    const { userId, password } = req.body;

    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.password.trim() !== password.trim()) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.json({
      user: {
        userId: user.userId,
        username: user.username,
        role: user.role,
        department: user.department,
        designation: user.designation
      }
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
