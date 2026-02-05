const express = require("express");
const router = express.Router();
const Leave = require("../models/Leave");

/* =========================================================
   HELPER — AUTO CL CALCULATION (MONTHLY FROM 26th)
   ========================================================= */
function calculateTotalCL() {
  const startDate = new Date("2024-12-26");
  const today = new Date();

  let months = 0;
  let temp = new Date(startDate);

  while (temp <= today) {
    months++;
    temp.setMonth(temp.getMonth() + 1);
  }
  return months;
}

/* =========================================================
   APPLY LEAVE
   ========================================================= */
router.post("/apply", async (req, res) => {
  try {
    const {
      facultyId,
      facultyName,
      role,
      department,
      leaveType,
      fromDate,
      toDate,
      reason,
      adjustments = []
    } = req.body;

    if (!facultyId || !fromDate || !toDate || !leaveType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const start = new Date(fromDate);
    const end = new Date(toDate);
    const totalDays =
      Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    let approvalFlow = [];

    if (role === "Faculty") {
      approvalFlow = ["Alternate", "HOD", "Principal"];
      if (totalDays >= 3) approvalFlow.push("Secretary");
    }

    if (role === "HOD") {
      approvalFlow = ["Alternate", "Principal"];
      if (totalDays >= 3) approvalFlow.push("Secretary");
    }

    if (role === "Principal") {
      approvalFlow = ["Secretary"];
    }

    // 🔥 IMPORTANT: initialize alternate status
    const normalizedAdjustments = adjustments.map(a => ({
      ...a,
      alternateStatus: "Pending"
    }));

    const leave = new Leave({
      facultyId,
      facultyName,
      role,
      department,
      leaveType,
      fromDate,
      toDate,
      totalDays,
      reason,
      adjustments: normalizedAdjustments,
      approvalFlow,
      currentLevel: 0,
      status: normalizedAdjustments.length > 0
        ? "Pending-Alternate"
        : "Pending-HOD"
    });

    await leave.save();
    res.json({ message: "Leave applied successfully" });

  } catch (err) {
    console.error("APPLY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================================================
   FACULTY LEAVE SUMMARY
   ========================================================= */
router.get("/summary/:facultyId", async (req, res) => {
  try {
    const leaves = await Leave.find({
      facultyId: req.params.facultyId
    }).sort({ createdAt: -1 });

    const totalCL = calculateTotalCL();
    const usedCL = leaves
      .filter(l => l.leaveType === "CL" && l.status === "Approved")
      .reduce((s, l) => s + (l.totalDays || 1), 0);

    res.json({
      totalCL,
      usedCL,
      remainingCL: totalCL - usedCL,
      leaves
    });
  } catch (err) {
    res.status(500).json({ message: "Error loading leave summary" });
  }
});

/* =========================================================
   ALTERNATE — FETCH
   ========================================================= */
router.get("/alternate/:facultyId", async (req, res) => {
  try {
    const leaves = await Leave.find({
      status: "Pending-Alternate",
      "adjustments.adjustedFacultyId": req.params.facultyId,
      "adjustments.alternateStatus": "Pending"
    });

    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: "Error loading alternate approvals" });
  }
});

/* =========================================================
   ALTERNATE — APPROVE
   ========================================================= */
router.post("/alternate/approve/:id", async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    leave.adjustments.forEach(a => {
      if (a.alternateStatus === "Pending") {
        a.alternateStatus = "Approved";
      }
    });

    leave.status = "Pending-HOD";
    leave.currentLevel = 1;

    await leave.save();
    res.json({ message: "Approved & forwarded to HOD" });

  } catch (err) {
    res.status(500).json({ message: "Action failed" });
  }
});

/* =========================================================
   ALTERNATE — REJECT (WITH REASON)
   ========================================================= */
router.post("/alternate/reject/:id", async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ message: "Rejection reason required" });
    }

    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    leave.adjustments.forEach(a => {
      if (a.alternateStatus === "Pending") {
        a.alternateStatus = "Rejected";
        a.alternateReason = reason;
      }
    });

    leave.status = "Rejected";
    leave.rejectionReason = reason;

    await leave.save();
    res.json({ message: "Leave rejected successfully" });

  } catch (err) {
    res.status(500).json({ message: "Action failed" });
  }
});

/* =========================================================
   HOD — FETCH
   ========================================================= */
router.get("/hod/pending", async (req, res) => {
  try {
    const leaves = await Leave.find({
      status: "Pending-HOD"
    }).sort({ createdAt: -1 });

    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: "Error fetching HOD leaves" });
  }
});

/* =========================================================
   HOD — APPROVE / REJECT
   ========================================================= */
router.post("/hod/approve/:id", async (req, res) => {
  const leave = await Leave.findById(req.params.id);
  if (!leave) return res.status(404).json({ message: "Leave not found" });

  leave.status = "Pending-Principal";
  leave.currentLevel = 2;
  await leave.save();

  res.json({ message: "Approved & forwarded to Principal" });
});

router.post("/hod/reject/:id", async (req, res) => {
  const { reason } = req.body;
  const leave = await Leave.findById(req.params.id);
  if (!leave) return res.status(404).json({ message: "Leave not found" });

  leave.status = "Rejected";
  leave.rejectionReason = reason;
  await leave.save();

  res.json({ message: "Rejected by HOD" });
});

/* =========================================================
   PRINCIPAL / SECRETARY
   ========================================================= */
router.get("/principal/pending", async (_, res) => {
  res.json(await Leave.find({ status: "Pending-Principal" }));
});

router.post("/principal/approve/:id", async (req, res) => {
  const leave = await Leave.findById(req.params.id);
  leave.status = leave.approvalFlow.includes("Secretary")
    ? "Pending-Secretary"
    : "Approved";
  await leave.save();
  res.json({ message: "Approved" });
});

router.get("/secretary/pending", async (_, res) => {
  res.json(await Leave.find({ status: "Pending-Secretary" }));
});

router.post("/secretary/approve/:id", async (req, res) => {
  const leave = await Leave.findById(req.params.id);
  leave.status = "Approved";
  await leave.save();
  res.json({ message: "Final approval done" });
});

/* =========================================================
   CANCEL LEAVE
   ========================================================= */
router.delete("/cancel/:id", async (req, res) => {
  const leave = await Leave.findById(req.params.id);
  if (!leave) return res.status(404).json({ message: "Leave not found" });
  if (!leave.status.startsWith("Pending")) {
    return res.status(400).json({ message: "Cannot cancel" });
  }

  await leave.deleteOne();
  res.json({ message: "Leave cancelled" });
});

module.exports = router;
