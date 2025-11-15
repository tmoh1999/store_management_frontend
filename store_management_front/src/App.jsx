import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ManageProducts from "./pages/ManageProducts";
import ManageSales from "./pages/ManageSales";
// you will create these pages

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/products/manageproducts" element={<ManageProducts />} />
      <Route path="/sales/managesales" element={<ManageSales />} />
      {/* Add the remaining routes */}
    </Routes>
  );
}