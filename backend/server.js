const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const timetableRoutes = require("./routes/timetable.routes");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const attendanceRoutes = require("./routes/attendance.routes");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/erp");

app.use("/api/timetable", require("./routes/timetable.routes"));
app.use("/api/attendance", require("./routes/attendance.routes"));
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use(express.json());

app.listen(5000, () =>
  console.log("ERP Backend running on http://localhost:5000")
);
