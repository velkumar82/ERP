import axios from "axios";

export default function AdminCsvUpload() {
  const upload = async e => {
    const form = new FormData();
    form.append("file", e.target.files[0]);
    await axios.post("http://localhost:5000/api/timetable/upload", form);
    alert("CSV uploaded");
  };

  return <input type="file" accept=".csv" onChange={upload} />;
}
