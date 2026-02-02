import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/leave.css";

/* Convert date to weekday */
const getDayName = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", { weekday: "long" });

export default function LeaveApply({ remainingCL }) {
  const user = JSON.parse(localStorage.getItem("erpUser"));

  const [leaveType, setLeaveType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [session, setSession] = useState("");
  const [reason, setReason] = useState("");

  const [classes, setClasses] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [showAdjustment, setShowAdjustment] = useState(false);

  /* Load faculty list for adjustment */
  useEffect(() => {
    axios.get("http://localhost:5000/api/users")
      .then(res => setFacultyList(res.data))
      .catch(() => setFacultyList([]));
  }, []);

  /* ----------------------------------------
      SUBMIT FINAL LEAVE (WITH / WITHOUT ADJ)
     --------------------------------------- */
  const submitLeave = async (adjustments) => {

    // Adjustment validation
    if (adjustments.length > 0) {
      const missing = adjustments.some(a => !a.adjustedFacultyId);
      if (missing) {
        alert("Please select adjusting faculty for all classes");
        return;
      }
    }

    try {
      await axios.post("http://localhost:5000/api/leave/apply", {
        facultyId: user.userId,
        facultyName: user.username,
        designation: user.designation,
        department: user.department,

        leaveType,
        fromDate,
        toDate,
        session,
        reason,

        adjustments,
        status: "Pending-HOD"
      });

      alert("Leave applied successfully");

      // Reset
      setClasses([]);
      setShowAdjustment(false);
      setLeaveType("");
      setFromDate("");
      setToDate("");
      setSession("");
      setReason("");

    } catch (err) {
      console.error(err);
      alert("Error applying leave");
    }
  };

  /* ----------------------------------------
      MAIN APPLY LOGIC
     --------------------------------------- */
  const applyLeave = async () => {

    if (!leaveType || !fromDate || !toDate || !session || !reason) {
      alert("All fields are required");
      return;
    }

    if (leaveType === "CL" && remainingCL <= 0) {
      alert("No CL available. Select LOP.");
      return;
    }

    // Load timetable from DB
    const ttRes = await axios.get(
      `http://localhost:5000/api/timetable/faculty/${user.userId}`
    );
    const timetable = ttRes.data;

    // Determine valid hours
    let validHours = [];
    if (session === "FN") validHours = [1, 2, 3, 4];
    else if (session === "AN") validHours = [5, 6, 7];
    else validHours = [1, 2, 3, 4, 5, 6, 7];

    const affected = [];

    // Loop through date range
    for (let d = new Date(fromDate); d <= new Date(toDate); d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().slice(0, 10);
      const dayName = getDayName(dateStr);

      timetable.forEach(t => {
        if (t.day === dayName && validHours.includes(t.hour)) {
          affected.push({
            date: dateStr,
            hour: t.hour,
            subject: t.subject,
            section: `${t.department} ${t.year} ${t.section}`,
            adjustedFacultyId: ""
          });
        }
      });
    }

    // If NO classes → submit directly
    if (affected.length === 0) {
      submitLeave([]);
    } else {
      // Showing adjustment UI
      setClasses(affected);
      setShowAdjustment(true);
    }
  };

  return (
    <div className="leave-card">

      <h2 className="leave-title">Leave Application</h2>

      {/* ========= FORM ========= */}
      <div className="leave-form-grid">

        <div>
          <label>Leave Type</label>
          <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
            <option value="">Select</option>
            <option value="CL">Casual Leave (CL)</option>
            <option value="LOP">Loss of Pay (LOP)</option>
          </select>
          <small>Remaining CL: {remainingCL}</small>
        </div>

        <div>
          <label>Session</label>
          <select value={session} onChange={(e) => setSession(e.target.value)}>
            <option value="">Select</option>
            <option value="FN">FN </option>
            <option value="AN">AN </option>
            <option value="Full Day">Full Day </option>
          </select>
        </div>

        <div>
          <label>From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div>
          <label>To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <div className="full-width">
          <label>Reason</label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          ></textarea>
        </div>
      </div>

      <button className="btn-primary" onClick={applyLeave}>
        Apply Leave
      </button>

      {/* ========= ADJUSTMENT UI ========= */}
      {showAdjustment && (
        <div className="adjustment-container">
          <h3>Class Adjustment Required</h3>

          <table className="adjustment-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Hour</th>
                <th>Subject</th>
                <th>Section</th>
                <th>Adjust Faculty</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((c, i) => (
                <tr key={i}>
                  <td>{c.date}</td>
                  <td>{c.hour}</td>
                  <td>{c.subject}</td>
                  <td>{c.section}</td>

                  <td>
                    <select
                      value={c.adjustedFacultyId}
                      onChange={(e) => {
                        const updated = [...classes];
                        updated[i] = {
                          ...updated[i],
                          adjustedFacultyId: e.target.value
                        };
                        setClasses(updated);
                      }}
                    >
                      <option value="">Select Faculty</option>
                      {facultyList.map((f) => (
                        <option key={f.userId} value={f.userId}>
                          {f.username}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            className="btn-primary"
            onClick={() => submitLeave(classes)}
          >
            Submit Leave with Adjustment
          </button>
        </div>
      )}

    </div>
  );
}
