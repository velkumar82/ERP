const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const Timetable = require("../models/Timetable");

const router = express.Router();

if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");
const upload = multer({ dest: "uploads/" });

// normalize headers (BOM, spaces, case)
const normalize = key =>
  key.replace(/\uFEFF/g, "").trim().toLowerCase();

router.post("/upload", upload.single("file"), (req, res) => {
  const records = [];

  fs.createReadStream(req.file.path)
    .pipe(csv({ mapHeaders: ({ header }) => normalize(header) }))
    .on("data", row => {
      try {
        const facultyId = row.facultyid || row.faculty_id;
        const day = row.day;

        // SUPPORT BOTH FORMATS
        const startRaw = row.period_start || row.hour;
        const endRaw = row.period_end || row.hour;

        const start = Number(startRaw);
        const end = Number(endRaw);

        if (!facultyId || !day || isNaN(start) || isNaN(end)) return;

        // 🔑 CORE LOGIC: EXPAND HOURS
        for (let h = start; h <= end; h++) {
          records.push({
            facultyId: facultyId.trim(),
            facultyName: row.facultyname || row.faculty_name || "",
            department: row.department || "",
            year: row.year || "",
            section: row.section || "",
            day: day.trim(),
            hour: h,                      // ✅ stores 5,6,7
            subject: row.subject || "",
            academicYear: row.academicyear || ""
          });
        }
      } catch (err) {
        console.error("CSV row error:", err);
      }
    })
    .on("end", async () => {
      try {
        fs.unlinkSync(req.file.path);

        if (records.length === 0) {
          return res.status(400).json({
            message: "CSV parsed but no valid timetable rows found"
          });
        }

        // OPTIONAL: clear old timetable
        await Timetable.deleteMany({});
        await Timetable.insertMany(records);

        res.json({
          message: "Timetable uploaded successfully",
          insertedHours: records.length
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database insert failed" });
      }
    });
});

router.get("/faculty/:facultyId", async (req, res) => {
  const data = await Timetable.find({ facultyId: req.params.facultyId });
  res.json(data);
});

module.exports = router;
