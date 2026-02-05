const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const timetableRoutes = require("./routes/timetable.routes");
const userRoutes = require("./routes/User.routes");
const attendanceRoutes = require("./routes/attendance.routes");
const leaveRoutes = require("./routes/leave.routes");

require("./cron/clIncrement");

const app = express();

/* ===== MIDDLEWARE ===== */
app.use(cors());
app.use(express.json());

/* ===== DATABASE ===== */
mongoose
  .connect("mongodb://127.0.0.1:27017/erp")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

/* ===== ROUTES ===== */
app.use("/api/timetable", timetableRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/users", userRoutes);
app.use("/api/topic", require("./routes/topic.routes"));
app.use("/api/leave", require("./routes/leave.routes"));
app.use("/api/biometric", require("./routes/biometric.routes"));


/* ===== SERVER ===== */
app.listen(5000, () =>
  console.log("ERP Backend running on http://localhost:5000")
);
