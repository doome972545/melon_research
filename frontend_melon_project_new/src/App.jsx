import React, { useContext, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";
import ButtomBar from "./page/AddminPage/buttombar/buttomBar";
import Login from "./page/login/login";
import ThemeContext, { ThemeProvider } from "./utils/ThemeContext";
import AddHouse from "./page/AddData/AddHouse";
import OldData from "./page/AddData/Old_Data/OldData";
import { jwtDecode } from "jwt-decode";
import WaitForApprove from "./page/waitForApprove/WaitForApprove";
import Register from "./page/register/Register";

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { setUser, user } = useContext(ThemeContext);

  const checkUserAndToken = () => {
    return user && token; // ตรวจสอบว่ามีผู้ใช้และ token
  };

  useEffect(() => {
    const isAuthenticated = checkUserAndToken();
    let newUser;
    if (window.location.pathname === "/register") {
      return;
    }

    if (isAuthenticated) {
      const decoded = jwtDecode(isAuthenticated);
      newUser = decoded;
    }
    // console.log(newUser)
    if (newUser) {
      if (newUser.status === "user") {
        navigate("/notApprove");
      }
      setUser(newUser);
    }
    if (!isAuthenticated) {
      navigate("/login"); // นำทางไปที่หน้าล็อกอินถ้าไม่มีผู้ใช้หรือ token
    } else if (user.status === "admin") {
      navigate("/Admin"); // นำทางไปที่หน้า Admin ถ้าผู้ใช้เป็นแอดมิน
    }
  }, [navigate]);

  return (
    <Routes>
      <Route
        path="*"
        element={<Navigate to={checkUserAndToken() ? "/homeUser" : "/login"} />}
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/Admin"
        element={
          user.status === "admin" ? <ButtomBar /> : <Navigate to="/login" />
        }
      />
      <Route path="/notApprove" element={<WaitForApprove />} />
      <Route
        path="/homeUser"
        element={
          user.status === "farmer" ? <AddHouse /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/olddata"
        element={user ? <OldData /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

export default function MainApp() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  );
}
