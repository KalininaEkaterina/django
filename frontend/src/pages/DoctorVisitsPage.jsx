import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./doctorVisits.css";

export default function DoctorVisitsPage() {
  const [visits, setVisits] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/doctor/visits", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => res.json())
      .then(setVisits);
  }, []);

  function deleteVisit(id) {
    if (!window.confirm("Вы уверены, что хотите удалить посещение?")) return;

    fetch(`http://localhost:5000/api/doctor/visits/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(() => {
      setVisits(visits.filter(v => v._id !== id));
    });
  }

  return (
    <div className="page-wrapper">
      <div className="card">
        <h2>Записи</h2>

        {visits.length === 0 && <p>У вас пока нет записей.</p>}

        <ul>
          {visits.map(visit => (
            <li key={visit._id}>
              <strong>Дата и время:</strong>{" "}
              {new Date(visit.schedule.date).toLocaleDateString()}{" "}
              {visit.schedule.time_start} – {visit.schedule.time_end}
              <br />

              <strong>Клиент:</strong>{" "}
              {visit.client.first_name} {visit.client.last_name}
              <br />

              <strong>Email:</strong> {visit.client.email || "не указан"}
              <br />

              <strong>Услуги:</strong>
              <ul>
                {visit.services.map(s => (
                  <li key={s._id}>
                    {s.name} — {s.price} ₽
                  </li>
                ))}
              </ul>

              <strong>Общая стоимость:</strong> {visit.total_price} ₽
              <br />

              <button
                className="btn"
                onClick={() => navigate(`/doctor/visits/${visit._id}/edit`)}
              >
                Редактировать
              </button>

              <button
                className="btn delete"
                onClick={() => deleteVisit(visit._id)}
              >
                Удалить
              </button>
            </li>
          ))}
        </ul>

        <button
          className="btn back"
          onClick={() => navigate("/doctor/services")}
        >
          ← Назад
        </button>
      </div>
    </div>
  );
}
