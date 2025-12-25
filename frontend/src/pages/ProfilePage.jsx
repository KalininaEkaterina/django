import { useEffect, useState } from "react";
import DoctorProfile from "./DoctorProfile";
import ClientProfile from "./ClientProfile";

export default function ProfilePage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/profile", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <div>Loading...</div>;

  if (data.role === "doctor") {
    return <DoctorProfile data={data} />;
  }

  return <ClientProfile data={data} />;
}
