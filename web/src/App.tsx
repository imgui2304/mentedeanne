import { useEffect } from "react";
import "./App.css";
import Login from "./pages/Login";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
  <Login />
  );
}

export default App;
