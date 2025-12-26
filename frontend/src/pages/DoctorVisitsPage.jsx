import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./doctor.css";

export default function DoctorVisitsPage() {
  const [visits, setVisits] = useState([]);
  const [selectedVisit, setSelectedVisit] = useState(null);

  const loadVisits = () => {
    fetch("http://localhost:5000/api/doctor/visits", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(setVisits);
  };

  useEffect(loadVisits, []);

  const handleDelete = (id) => {
    if (window.confirm("Вы уверены, что хотите удалить это посещение?")) {
      fetch(`http://localhost:5000/api/doctor/visits/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      }).then(loadVisits);
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/api/doctor/visits/${selectedVisit._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        diagnosis_text: selectedVisit.diagnosis_text,
        date: selectedVisit.schedule.date,
        time_start: selectedVisit.schedule.time_start,
        time_end: selectedVisit.schedule.time_end
      })
    }).then(() => {
      setSelectedVisit(null);
      loadVisits();
    });
  };

  return (
    <div className="doctor-services-container">
      <div className="card" style={{ alignItems: "stretch" }}>
        <h2 className="gradienttext">Записи пациентов</h2>

        <ul>
          {visits.map(v => (
            <li key={v._id} className="visit-item">
              <strong>Пациент:</strong> {v.client?.first_name} {v.client?.last_name}<br/>
              <strong>Время:</strong> {new Date(v.schedule?.date).toLocaleDateString()} {v.schedule?.time_start}<br/>
              <strong>Услуги:</strong> {v.services?.map(s => s.name).join(", ")}<br/>
              <strong>Диагноз:</strong> {v.diagnosis_text || "Не назначен"}<br/>

              <button className="btn" onClick={() => setSelectedVisit({...v})}>Редактировать</button>
              <button className="btn delete" onClick={() => handleDelete(v._id)}>Удалить</button>
            </li>
          ))}
        </ul>
      </div>

      {selectedVisit && (
        <div className="modal-overlay">
          <div className="card modal-content">
            <h3 className="gradienttext">Редактировать визит</h3>
            <form onSubmit={handleUpdate} style={{width: "100%"}}>
              <label>Дата:</label>
              <input type="date" value={selectedVisit.schedule.date.split('T')[0]}
                onChange={e => setSelectedVisit({...selectedVisit, schedule: {...selectedVisit.schedule, date: e.target.value}})} />

              <label>Начало:</label>
              <input type="time" value={selectedVisit.schedule.time_start}
                onChange={e => setSelectedVisit({...selectedVisit, schedule: {...selectedVisit.schedule, time_start: e.target.value}})} />

              <label>Диагноз:</label>
              <textarea value={selectedVisit.diagnosis_text}
                onChange={e => setSelectedVisit({...selectedVisit, diagnosis_text: e.target.value})} />

              <div style={{display: "flex", gap: "10px"}}>
                <button type="submit" className="btn">Сохранить</button>
                <button type="button" className="btn" style={{background: "#888"}} onClick={() => setSelectedVisit(null)}>Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}