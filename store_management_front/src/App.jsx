import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductList from "./pages/Products";
import { useEffect } from "react";
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
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/products" element={<ProductList />} />
    </Routes>
  );
}