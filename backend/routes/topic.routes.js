const express = require("express");
const TopicTaken = require("../models/TopicTaken");

const router = express.Router();

/* SAVE TOPIC TAKEN */
router.post("/save", async (req, res) => {
  try {
    const { date, year, department, section, facultyId, subject, topic } = req.body;

    if (!topic) {
      return res.status(400).json({ message: "Topic is required" });
    }

    const record = new TopicTaken({
      date,
      year,
      department,
      section,
      facultyId,
      subject,
      topic
    });

    await record.save();

    res.json({ message: "Topic saved successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving topic" });
  }
});

module.exports = router;
