const mongoose = require("mongoose");

const AdjustmentSchema = new mongoose.Schema({
  date: String,
  hour: Number,
  subject: String,
  section: String,
  adjustedFacultyId: String,
  alternateStatus: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
  },
  alternateReason: String
}, { _id: false });

const LeaveSchema = new mongoose.Schema({
  facultyId: String,
  facultyName: String,
  department: String,
  role: String,

  leaveType: String,
  fromDate: String,
  toDate: String,
  totalDays: Number,
  reason: String,

  adjustments: [AdjustmentSchema],

  status: {
    type: String,
    enum: [
      "Pending-Alternate",
      "Pending-HOD",
      "Pending-Principal",
      "Pending-Secretary",
      "Approved",
      "Rejected"
    ],
    default: "Pending-Alternate"
  },

  rejectionReason: String,
  currentLevel: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Leave", LeaveSchema);
