const express = require("express");
const router = express.Router();
const Leave = require("../models/Leave");

/* =========================
   APPLY LEAVE
   ========================= */
router.post("/apply", async (req, res) => {
  try {
    const leave = new Leave({
      ...req.body,
      status: "Pending-HOD"
    });
    await leave.save();
    res.json({ message: "Leave applied successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   CANCEL LEAVE  (FIXED)
   ========================= */
router.put("/cancel/:id", async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    // ✅ Normalize status (space → hyphen)
    const normalizedStatus = leave.status.replace(/\s+/g, "-");

    console.log("Cancel attempt:", leave._id, normalizedStatus);

    if (normalizedStatus === "Approved") {
      return res.status(400).json({
        message: "Approved leave cannot be cancelled"
      });
    }

    if (normalizedStatus === "Cancelled") {
      return res.status(400).json({
        message: "Leave already cancelled"
      });
    }

    leave.status = "Cancelled";
    await leave.save();

    res.json({ message: "Leave cancelled successfully" });

  } catch (err) {
    console.error("Cancel error:", err);
    res.status(500).json({ message: "Cancel failed" });
  }
});

/* =========================
   LEAVE SUMMARY
   ========================= */
router.get("/summary/:facultyId", async (req, res) => {
  const leaves = await Leave.find({ facultyId: req.params.facultyId });

  const CL_START_DATE = new Date("2025-12-01");
  const now = new Date();

  let totalCL =
    (now.getFullYear() - CL_START_DATE.getFullYear()) * 12 +
    (now.getMonth() - CL_START_DATE.getMonth()) + 1;

  totalCL = Math.max(0, Math.min(totalCL, 12));

  const usedCL = leaves.filter(l =>
    l.leaveType === "CL" &&
    !["Rejected", "Cancelled"].includes(l.status.replace(/\s+/g, "-"))
  ).length;

  res.json({
    totalCL,
    usedCL,
    remainingCL: totalCL - usedCL,
    leaves: leaves || []
  });
});

module.exports = router;
const PDFDocument = require("pdfkit");

/* =========================
   GET LEAVES FOR ROLE
   ========================= */
router.get("/pending/:role", async (req, res) => {
  let status = "";

  if (req.params.role === "HOD") status = "Pending-HOD";
  if (req.params.role === "Principal") status = "Pending-Principal";

  const leaves = await Leave.find({ status });
  res.json(leaves);
});

/* =========================
   APPROVE / REJECT
   ========================= */
router.put("/approve/:id", async (req, res) => {
  const { role, action } = req.body;

  const leave = await Leave.findById(req.params.id);
  if (!leave) return res.status(404).json({ message: "Leave not found" });

  if (action === "Reject") {
    leave.status = "Rejected";
  } else {
    leave.status =
      role === "HOD" ? "Pending-Principal" : "Approved";
  }

  await leave.save();
  res.json({ message: `Leave ${leave.status}` });
});

/* =========================
   PDF LEAVE REGISTER
   ========================= */
router.get("/pdf", async (req, res) => {
  const leaves = await Leave.find();

  const doc = new PDFDocument({ margin: 30, size: "A4" });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=LeaveRegister.pdf");

  doc.pipe(res);

  doc.fontSize(16).text("LEAVE REGISTER", { align: "center" });
  doc.moveDown();

  leaves.forEach((l, i) => {
    doc
      .fontSize(10)
      .text(
        `${i + 1}. ${l.facultyName} | ${l.leaveType} | ${l.fromDate} → ${l.toDate} | ${l.status}`
      );
  });

  doc.end();
});
