const mongoose = require("mongoose");

const BiometricSchema = new mongoose.Schema({
  facultyId: String,
  date: String,           // YYYY-MM-DD
  day: String,            // Monday, Tuesday
  inTime: String,         // 09:05
  outTime: String,        // 16:35
  academicYear: String,   // 2025-2026
  month: String,          // 01-12 (for filter)
  remark: String          // "", CL, LOP, CL (Pending), Sunday
});

module.exports = mongoose.model("Biometric", BiometricSchema);
