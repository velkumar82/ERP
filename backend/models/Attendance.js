const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  date: { type: String, required: true },   // YYYY-MM-DD
  day: String,
  hour: { type: Number, required: true },

  facultyId: String,

  department: String,
  year: String,
  section: String,
  subject: String,

  registerNo: { type: String, required: true },
  status: String
});

/* 🔒 LOCK = student + hour + class + date */
attendanceSchema.index(
  {
    date: 1,
    hour: 1,
    department: 1,
    year: 1,
    section: 1,
    registerNo: 1
  },
  { unique: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
