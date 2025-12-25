import { useEffect, useState, useCallback } from "react";
import "./profile.css";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    min_price: "",
    max_price: "",
    search: ""
  });

  const loadServices = useCallback(() => {
    const params = new URLSearchParams(filters);
    fetch("http://localhost:5000/services?" + params.toString())
      .then(res => res.json())
      .then(setServices);
  }, [filters]);

  useEffect(() => {
    fetch("http://localhost:5000/services/categories")
      .then(res => res.json())
      .then(setCategories);

    loadServices();
  }, [loadServices]);

  function updateFilter(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  return (
    <div className="profile-page-wrapper">

      {/* Хедер как в Django */}
      <header className="page-header">
        <button className="login-btn">Профиль</button>
      </header>

      <div className="card">
        {/* ЛЕВАЯ КОЛОНКА (ФИЛЬТРЫ) */}
        <div className="left-container">
          <h2 className="gradienttext">Фильтр</h2>

          <label style={{ color: "white" }}>Категория:</label>
          <select
            name="category"
            onChange={updateFilter}
            className="btn"
          >
            <option value="">Все</option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>

          <br />

          <label style={{ color: "white" }}>Цена от:</label>
          <input
            type="number"
            name="min_price"
            onChange={updateFilter}
            className="btn"
          />

          <label style={{ color: "white" }}>до:</label>
          <input
            type="number"
            name="max_price"
            onChange={updateFilter}
            className="btn"
          />

          <button onClick={loadServices} className="btn" style={{ marginTop: "15px" }}>
            Фильтр
          </button>
        </div>

        {/* ПРАВАЯ КОЛОНКА (СПИСОК УСЛУГ) */}
        <div className="right-container">
          <h3 className="gradienttext">Список услуг</h3>

          <ul>
            {services.length > 0 ? (
              services.map(s => (
                <li key={s._id}>
                  <p>
                    <strong>{s.name}</strong> — {s.price} руб.<br />
                    Категория: {s.category?.name || "Без категории"}
                  </p>
                  <button className="btn">Подробнее</button>
                </li>
              ))
            ) : (
              <li><p>Нет услуг по текущим фильтрам.</p></li>
            )}
          </ul>
        </div>
      </div>

      <a href="#" className="credit" style={{ color: "#5995fd" }}>Covid</a>
      <a href="#" className="credit" style={{ color: "#5995fd" }}>Covid Belarus</a>
    </div>
  );
}
