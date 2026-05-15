import {
  Routes,
  Route
} from "react-router-dom";

import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import DoctorDetails from "./pages/DoctorDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import DoctorDashboard
from "./pages/DoctorDashboard";
import AdminManagement from "./pages/AdminManagement";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSlots from "./pages/AdminSlots";
import ManageDoctorSlots
from "./pages/ManageDoctorSlots";

function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/doctors"
        element={<Doctors />}
      />

      <Route
        path="/doctors/:id"
        element={<DoctorDetails />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/account"
        element={<Account />}
      />

      <Route
        path="/doctor-dashboard"
        element={<DoctorDashboard />}
      />

      <Route
        path="/admin-dashboard"
        element={<AdminDashboard />}
      />

      <Route
        path="/admin-management"
        element={<AdminManagement />}
      />

<Route
path="/admin-slots"
element={<AdminSlots />}
/>

<Route
path="/admin-slots/:doctorId"
element={<ManageDoctorSlots />}
/>

    </Routes>
  );
}

export default App;