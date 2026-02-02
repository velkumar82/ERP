const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userId: String,
  username: String,
  designation: String,
  department: String,
  email: String,
  password: String,
  role: String
});

/* ✅ SAFE EXPORT */
module.exports =
  mongoose.models.User || mongoose.model("User", UserSchema);
