import { useEffect, useState } from "react";
import "./profile.css";

export default function DoctorServicesPage() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: ""
  });
  const [search, setSearch] = useState("");

  function loadServices() {
    fetch(`http://localhost:5000/services/doctor?search=${search}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => res.json())
      .then(setServices);
  }

  useEffect(loadServices, [search]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function createService(e) {
    e.preventDefault();
    fetch("http://localhost:5000/services/doctor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(form)
    }).then(() => {
      setForm({ name: "", price: "", description: "" });
      loadServices();
    });
  }

  function deleteService(id) {
    fetch(`http://localhost:5000/services/doctor/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(loadServices);
  }

  return (
    <div className="profile-page-wrapper">
      <header className="page-header">
        <button className="login-btn">Профиль</button>
      </header>

      <div className="card">

          <div className="left-container">
            <h3 className="gradienttext">Добавление услуги</h3>

            <form onSubmit={createService}>
              <input name="name" placeholder="Название" value={form.name} onChange={handleChange} />
              <input name="price" placeholder="Цена" value={form.price} onChange={handleChange} />
              <textarea name="description" placeholder="Описание" value={form.description} onChange={handleChange} />
              <button className="btn">Добавить</button>
            </form>
          </div>

          <div className="right-container">
            <input placeholder="Поиск" onChange={e => setSearch(e.target.value)} />

            <ul>
              {services.map(s => (
                <li key={s._id}>
                  <strong>{s.name}</strong> — {s.price} руб.
                  <br />
                  {s.description}
                  <br />
                  <button className="btn" onClick={() => deleteService(s._id)}>
                    Удалить
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
    </div>
  );
}
