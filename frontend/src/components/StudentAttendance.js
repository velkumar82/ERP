import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/dashboard.css";

export default function StudentAttendance() {

  const user = JSON.parse(localStorage.getItem("erpUser"));
  const facultyId = user?.userId;

  const todayDate = new Date().toISOString().slice(0, 10);
  const todayDay = new Date().toLocaleDateString("en-US", { weekday: "long" });

  const [slots, setSlots] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [years, setYears] = useState([]);
  const [sections, setSections] = useState([]);
  const [hours, setHours] = useState([]);
  const [lockedHours, setLockedHours] = useState([]);

  const [dept, setDept] = useState("");
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");
  const [hour, setHour] = useState("");

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});

  /* ===== LOAD TODAY TIMETABLE ===== */
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/attendance/hours/${facultyId}`)
      .then(res => {
        setSlots(res.data);
        setDepartments([...new Set(res.data.map(s => s.department))]);
      });
  }, [facultyId]);

  /* ===== DROPDOWN CASCADE ===== */
  useEffect(() => {
    setYears([...new Set(slots.filter(s => s.department === dept).map(s => s.year))]);
    setYear(""); setSection(""); setHour("");
  }, [dept]);

  useEffect(() => {
    setSections([...new Set(slots.filter(s => s.department === dept && s.year === year).map(s => s.section))]);
    setSection(""); setHour("");
  }, [year]);

  useEffect(() => {
    setHours(
      slots
        .filter(s => s.department === dept && s.year === year && s.section === section)
        .map(s => s.hour)
    );
    setHour("");
  }, [section]);

  /* ===== LOAD LOCKED HOURS ===== */
  useEffect(() => {
    if (!dept || !year || !section) return;

    axios.get("http://localhost:5000/api/attendance/locked-hours", {
      params: { date: todayDate, department: dept, year, section }
    })
    .then(res => setLockedHours(res.data));
  }, [dept, year, section]);

  /* ===== LOAD STUDENTS ===== */
  useEffect(() => {
    if (!dept || !year || !section || !hour) return;

    axios
      .get("http://localhost:5000/api/attendance/students", {
        params: { department: dept, year, section }
      })
      .then(res => setStudents(res.data));
  }, [hour]);

  /* ===== SUBMIT ===== */
  const submitAttendance = async () => {
    const records = students.map(s => ({
      date: todayDate,
      day: todayDay,
      hour,
      facultyId,
      department: dept,
      year,
      section,
      registerNo: s.registerNo,
      status: attendance[s.registerNo] || "Present"
    }));

    try {
      await axios.post(
        "http://localhost:5000/api/attendance/mark",
        records
      );
      alert("Attendance submitted & hour locked");
      setLockedHours([...lockedHours, hour]);
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="card">
      <h3>Student Attendance – {todayDay}</h3>

      <div className="form-row">
        <select onChange={e => setDept(e.target.value)}>
          <option value="">Department</option>
          {departments.map(d => <option key={d}>{d}</option>)}
        </select>

        <select onChange={e => setYear(e.target.value)}>
          <option value="">Year</option>
          {years.map(y => <option key={y}>{y}</option>)}
        </select>

        <select onChange={e => setSection(e.target.value)}>
          <option value="">Section</option>
          {sections.map(s => <option key={s}>{s}</option>)}
        </select>

        <select onChange={e => setHour(Number(e.target.value))}>
          <option value="">Hour</option>
          {hours.map(h => (
            <option key={h} value={h} disabled={lockedHours.includes(h)}>
              Hour {h} {lockedHours.includes(h) ? "(Locked)" : ""}
            </option>
          ))}
        </select>
      </div>

      {students.length > 0 && (
        <>
          <table className="timetable">
            <thead>
              <tr>
                <th>Register No</th>
                <th>Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.registerNo}>
                  <td>{s.registerNo}</td>
                  <td>{s.name}</td>
                  <td>
                    <select
                      onChange={e =>
                        setAttendance({
                          ...attendance,
                          [s.registerNo]: e.target.value
                        })
                      }
                    >
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="btn-primary" onClick={submitAttendance}>
            Submit Attendance
          </button>
        </>
      )}
    </div>
  );
}
