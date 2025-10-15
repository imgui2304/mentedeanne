import { useEffect } from "react";
import "./index.css";

import { useNavigate } from "react-router-dom";
import LoginPage from "./features/auth/pages/LoginPage";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
  <LoginPage />
  );
}

export default App;
