const express = require("express");
const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const Timetable = require("../models/Timetable");

const router = express.Router();

/* =========================
   GET TODAY HOURS (FACULTY)
   ========================= */
router.get("/hours/:facultyId", async (req, res) => {
  try {
    const today = new Date().toLocaleDateString("en-US", {
      weekday: "long"
    });

    const slots = await Timetable.find({
      facultyId: req.params.facultyId,
      day: today
    });

    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   GET LOCKED HOURS (CLASS)
   ========================= */
router.get("/locked-hours", async (req, res) => {
  try {
    const { date, department, year, section } = req.query;

    const hours = await Attendance.distinct("hour", {
      date,
      department,
      year,
      section
    });

    res.json(hours);   // e.g. [2,6]
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   GET STUDENTS
   ========================= */
router.get("/students", async (req, res) => {
  try {
    const { department, year, section } = req.query;

    const students = await Student.find({
      department,
      year,
      section
    });

    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   SUBMIT ATTENDANCE
   ========================= */
router.post("/mark", async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({
        message: "No attendance data received"
      });
    }

    await Attendance.insertMany(req.body, { ordered: false });

    res.json({
      message: "Attendance submitted & locked for this hour"
    });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: "Attendance already submitted for this hour"
      });
    }

    console.error(err);
    res.status(500).json({
      message: "Attendance insert failed"
    });
  }
});

module.exports = router;
