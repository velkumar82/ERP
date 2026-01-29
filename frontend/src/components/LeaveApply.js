import { useState } from "react";
import "../styles/dashboard.css";

/* Convert date → day name */
const getDayFromDate = (dateStr) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  return days[new Date(dateStr).getDay()];
};

export default function LeaveApply({ remainingCL, applyLeave }) {

  const [leaveType, setLeaveType] = useState("");
  const [date, setDate] = useState("");
  const [session, setSession] = useState("");
  const [adjustmentClasses, setAdjustmentClasses] = useState([]);
  const [showAdjustment, setShowAdjustment] = useState(false);

  /* ===== SAMPLE FACULTY TIMETABLE (REPLACE WITH DB/API LATER) ===== */
  const facultyTimetable = [
    { day: "Monday", hour: 2, subject: "DBMS", section: "CSE II A" },
    { day: "Friday", hour: 5, subject: "DBMS", section: "CSE II A" },
    { day: "Friday", hour: 6, subject: "DBMS", section: "CSE II A" },
    { day: "Friday", hour: 7, subject: "DBMS", section: "CSE II A" }
  ];

  /* ===== APPLY LEAVE ===== */
  const handleApply = () => {
    if (!leaveType || !date || !session) {
      alert("Please fill all fields");
      return;
    }

    if (leaveType === "CL" && remainingCL <= 0) {
      alert("CL not available. Please select LOP.");
      return;
    }

    const leaveDay = getDayFromDate(date);

    // 🔥 THIS IS THE FIX: check timetable for SELECTED DAY
    const dayClasses = facultyTimetable.filter(
      t => t.day === leaveDay
    );

    if (dayClasses.length > 0) {
      setAdjustmentClasses(dayClasses);
      setShowAdjustment(true);
    } else {
      alert(`Leave applied successfully. No classes on ${leaveDay}.`);
      applyLeave({
        leaveType,
        date,
        session,
        status: "Pending"
      });
      setShowAdjustment(false);
    }
  };

  /* ===== FINAL SUBMIT WITH ADJUSTMENT ===== */
  const submitWithAdjustment = () => {
    applyLeave({
      leaveType,
      date,
      session,
      status: "Pending",
      adjustment: adjustmentClasses
    });
    setShowAdjustment(false);
  };

  return (
    <div className="leave-container">

      <h3 className="leave-title">Leave Application</h3>

      {/* ===== FORM ===== */}
      <div className="leave-form">

        <div className="leave-row">
          <label>Leave Type</label>
          <select onChange={(e) => setLeaveType(e.target.value)}>
            <option value="">Select</option>
            <option value="CL">Casual Leave (CL)</option>
            <option value="LOP">Loss of Pay (LOP)</option>
          </select>
        </div>

        <div className="leave-row">
          <label>Date</label>
          <input type="date" onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className="leave-row">
          <label>Session</label>
          <select onChange={(e) => setSession(e.target.value)}>
            <option value="">Select</option>
            <option>FN</option>
            <option>AN</option>
            <option>Full Day</option>
          </select>
        </div>

        <div className="leave-actions">
          <button className="btn-primary" onClick={handleApply}>
            Apply Leave
          </button>
        </div>
      </div>

      {/* ===== ADJUSTMENT SECTION ===== */}
      {showAdjustment && (
        <div className="adjustment-box">

          <h4>Class Adjustment Required</h4>

          <table className="timetable">
            <thead>
              <tr>
                <th>Hour</th>
                <th>Subject</th>
                <th>Section</th>
                <th>Adjusting Faculty</th>
              </tr>
            </thead>
            <tbody>
              {adjustmentClasses.map((c, i) => (
                <tr key={i}>
                  <td>{c.hour}</td>
                  <td>{c.subject}</td>
                  <td>{c.section}</td>
                  <td>
                    <select>
                      <option>Select Faculty</option>
                      <option>Dr. Anand</option>
                      <option>Ms. Priya</option>
                      <option>Mr. Ramesh</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="leave-actions">
            <button className="btn-primary" onClick={submitWithAdjustment}>
              Submit Leave with Adjustment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
