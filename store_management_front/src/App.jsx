import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
// you will create these pages

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Dashboard />} />
    </Routes>
  );
}