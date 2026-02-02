const express = require("express");
const router = express.Router();
const Biometric = require("../models/Biometric");

/* =========================
   SAVE BIOMETRIC (eSSL)
   ========================= */
router.post("/save", async (req, res) => {
  try {
    // req.body = array of records from eSSL
    await Biometric.insertMany(req.body);
    res.json({ message: "Biometric data saved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   GET BIOMETRIC BY FILTER
   ========================= */
router.get("/", async (req, res) => {
  const { facultyId, academicYear, month } = req.query;

  const records = await Biometric.find({
    facultyId,
    academicYear,
    month
  }).sort({ date: 1 });

  res.json(records);
});

module.exports = router;
