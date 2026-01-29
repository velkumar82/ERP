const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  registerNo: String,
  name: String,
  department: String,
  year: String,
  section: String
});

module.exports = mongoose.model("Student", studentSchema);
