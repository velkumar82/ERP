const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true },   // F001, F002
  name: String,
  department: String,
  email: String,
  mobile: String,
  role: { type: String, default: "Faculty" },
  password: String,                         // hashed later
  status: { type: String, default: "Active" }
});

module.exports = mongoose.model("User", userSchema);
