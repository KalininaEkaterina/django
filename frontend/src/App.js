import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import ServicesPage from "./pages/ServicesPage";
import DoctorServices from "./pages/DoctorServices";
import ProfilePage from "./pages/ProfilePage";
import Cart from "./pages/Cart";
import MyAppointments from "./pages/MyAppointment";
import EditProfilePage from "./pages/EditProfilePage";
import DoctorVisitsPage from "./pages/DoctorVisitsPage";
import EditVisitPage from "./pages/EditVisitPage";
import DoctorCategoriesPage from "./pages/DoctorCategories";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/doctor/services" element={<DoctorServices />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/appointment" element={<MyAppointments />} />
        <Route path="/doctor/visits" element={<DoctorVisitsPage />} />
        <Route path="/doctor/visits/:id/edit" element={<EditVisitPage />} />
        <Route path="/categories" element={<DoctorCategoriesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
