const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  email: String,
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["Admin", "Faculty", "HOD", "Principal", "Secretary"],
    required: true
  },
  clBalance: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports =
  mongoose.models.User || mongoose.model("User", UserSchema, "users");
