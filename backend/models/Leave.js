const mongoose = require("mongoose");

const AdjustmentSchema = new mongoose.Schema({
  date: String,
  hour: Number,
  subject: String,
  section: String,
  adjustedFacultyId: String
}, { _id: false });

const LeaveSchema = new mongoose.Schema({
  facultyId: String,
  facultyName: String,
  department: String,
  designation: String,

  leaveType: String,     // CL / LOP
  fromDate: String,
  toDate: String,
  session: String,
  reason: String,

  adjustments: [AdjustmentSchema],

  status: String,        // Pending-HOD / Pending-Principal / Approved / Rejected / Cancelled
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Leave", LeaveSchema);
