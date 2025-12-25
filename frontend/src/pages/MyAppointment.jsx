import { useEffect, useState } from "react";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/appointments/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        // защита: если вдруг не массив
        setAppointments(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error("Error loading appointments", err);
        setAppointments([]);
      });
  }, []);

  return (
    <div className="container">
      <h1>My appointments</h1>

      {appointments.length === 0 && <p>No appointments yet</p>}

      {appointments.map(a => (
        <div key={a._id}>
          <p>
            {a.date} — {a.timeStart}
          </p>
        </div>
      ))}
    </div>
  );
}
