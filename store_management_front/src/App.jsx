import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
// you will create these pages

export default function App() {
	useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      // Dynamically load Eruda
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/eruda";
      script.onload = () => {
        window.eruda.init();
        console.log("Eruda initialized on Android!");
      };
      document.body.appendChild(script);
    }
  }, []);
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Dashboard />} />
    </Routes>
  );
}