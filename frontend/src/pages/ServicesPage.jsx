import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./profile.css";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (token && role === "doctor") {
      navigate("/doctor/services", { replace: true });
    }
  }, [token, navigate]);

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
      .then(data => { if (Array.isArray(data)) setServices(data); });
  }, [filters]);

  useEffect(() => {
    fetch("http://localhost:5000/api/categories") // Убедитесь, что путь совпадает с вашим server.js
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setCategories(data); });
    loadServices();
  }, [loadServices]);

  function updateFilter(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  const handleAddToCart = (service) => {

      const currentCart = JSON.parse(localStorage.getItem("cart")) || [];

      const isAlreadyInCart = currentCart.some(item => item._id === service._id);

      if (!isAlreadyInCart) {
          const updatedCart = [...currentCart, service];
          localStorage.setItem("cart", JSON.stringify(updatedCart));
      }

      navigate("/cart");
  };

  return (
    <div className="profile-page-wrapper">
      <header className="page-header" style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px 20px' }}>
        {token ? (
          <button className="login-btn" onClick={() => navigate("/profile")}>Профиль</button>
        ) : (
          <button className="login-btn" onClick={() => navigate("/auth")}>Войти</button>
        )}
      </header>

      <div className="card">
        <div className="left-container">
          <h2 className="gradienttext">Фильтр</h2>

          <label style={{ color: "white" }}>Поиск:</label>
          <input
            placeholder="Название..."
            name="search"
            value={filters.search}
            onChange={updateFilter}
            className="btn"
            style={{ marginBottom: "10px", background: "white", color: "black" }}
          />

          <label style={{ color: "white" }}>Категория:</label>
          <select name="category" onChange={updateFilter} className="btn">
            <option value="">Все</option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>

          <label style={{ color: "white", marginTop: "10px" }}>Цена от:</label>
          <input type="number" name="min_price" onChange={updateFilter} className="btn" />

          <label style={{ color: "white" }}>до:</label>
          <input type="number" name="max_price" onChange={updateFilter} className="btn" />

          <button onClick={loadServices} className="btn" style={{ marginTop: "15px" }}>Применить</button>
        </div>

        <div className="right-container">
          <h3 className="gradienttext">Список услуг</h3>
          <ul style={{ padding: 0 }}>
            {services.length > 0 ? (
              services.map(s => (
                <li key={s._id} style={{
                  background: "rgba(255,255,255,0.1)",
                  padding: "15px",
                  borderRadius: "15px",
                  marginBottom: "10px",
                  listStyle: "none"
                }}>
                  <div style={{ color: "white" }}>
                    <strong>{s.name}</strong> — {s.price} руб.
                    <br />
                    <small style={{ color: "#ccc" }}>
                      Категория: {s.category?.name || "Без категории"}
                    </small>
                  </div>
                  {/* Кнопка "Подробнее" как в вашем Django шаблоне */}
                  <button
                    className="btn"
                    style={{ marginTop: "10px" }}
                    onClick={() => navigate(`/services/${s._id}`)}
                  >
                    Подробнее
                  </button>
                </li>
              ))
            ) : (
              <li style={{ listStyle: 'none' }}><p style={{ color: 'white' }}>Нет услуг по текущим фильтрам.</p></li>
            )}
          </ul>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px', paddingBottom: '20px' }}>
        <span className="credit" style={{ color: "#5995fd", marginRight: '15px', cursor: 'default' }}>
          Covid
        </span>
        <span className="credit" style={{ color: "#5995fd", cursor: 'default' }}>
          Covid Belarus
        </span>
      </div>
    </div>
  );
}