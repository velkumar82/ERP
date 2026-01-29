import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/timetable.css";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const HOURS = [1, 2, 3, 4, 5, 6, 7];

export default function FacultyTimetable() {
  const [grid, setGrid] = useState({});
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("erpUser"));
  const facultyId = user?.userId;

  useEffect(() => {
    if (!facultyId) return;

    axios
      .get(`http://localhost:5000/api/timetable/faculty/${facultyId}`)
      .then(res => {
        const timetableGrid = {};
        DAYS.forEach(day => (timetableGrid[day] = {}));

        res.data.forEach(item => {
          if (!item.day || item.hour === undefined) return;

          const day = item.day.trim();
          const hour = Number(item.hour);

          if (!DAYS.includes(day)) return;
          if (isNaN(hour) || hour < 1 || hour > 7) return;

          timetableGrid[day][hour] =
            `${item.subject} (${item.department} ${item.year} ${item.section})`;
        });

        setGrid(timetableGrid);
        setLoading(false);
      })
      .catch(err => {
        console.error("Timetable error", err);
        setLoading(false);
      });
  }, [facultyId]);

  if (loading) return <p>Loading timetable...</p>;

  return (
    <div className="card">
      <h3>My Timetable</h3>

      <table className="timetable-grid">
        <thead>
          <tr>
            <th>Day</th>
            {HOURS.map(h => (
              <th key={h}>Hour {h}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {DAYS.map(day => (
            <tr key={day}>
              <td className="day-col">{day}</td>
              {HOURS.map(hour => (
                <td key={hour}>{grid[day]?.[hour] || ""}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
