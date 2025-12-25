import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./profile.css";

export default function EditProfilePage() {
  const [role, setRole] = useState(null);
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/profile/edit", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setRole(data.role);
        setForm(data.profile || {});
      });
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function submit(e) {
    e.preventDefault();

    fetch("http://localhost:5000/api/profile/edit", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(form),
    }).then(() => navigate("/profile"));
  }

  if (!role) return <div>Loading...</div>;

  return (
    <div className="card">
      <h2 className="gradienttext">Edit profile</h2>

      <form onSubmit={submit}>
        <input
          name="firstName"
          placeholder="First name"
          value={form.firstName || ""}
          onChange={handleChange}
        />

        <input
          name="lastName"
          placeholder="Last name"
          value={form.lastName || ""}
          onChange={handleChange}
        />

        {role === "client" && (
          <>
            <input
              name="mobile"
              placeholder="Mobile"
              value={form.mobile || ""}
              onChange={handleChange}
            />
            <input
              name="address"
              placeholder="Address"
              value={form.address || ""}
              onChange={handleChange}
            />
          </>
        )}

        {role === "doctor" && (
          <>
            <input
              name="specialization"
              placeholder="Specialization"
              value={form.specialization || ""}
              onChange={handleChange}
            />
            <input
              name="category"
              placeholder="Category"
              value={form.category || ""}
              onChange={handleChange}
            />
            <input
              name="department"
              placeholder="Department"
              value={form.department || ""}
              onChange={handleChange}
            />
            <textarea
              name="info"
              placeholder="Info"
              value={form.info || ""}
              onChange={handleChange}
            />
          </>
        )}

        <button className="btn">Save</button>
      </form>
    </div>
  );
}
