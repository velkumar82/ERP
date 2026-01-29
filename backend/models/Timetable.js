const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({
  facultyId: String,
  facultyName: String,
  department: String,
  year: String,
  section: String,
  day: String,
  hour: Number,
  subject: String,
  academicYear: String
});

module.exports = mongoose.model("Timetable", timetableSchema);
