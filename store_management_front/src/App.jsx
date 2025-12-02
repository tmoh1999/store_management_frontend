import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductList from "./pages/Products";
import Purchases from "./pages/Purchases";
import Sales from "./pages/Sales";
import Transactions from "./pages/Transactions";
import AddProduct from "./pages/AddProduct";
import UpdateProduct from "./pages/UpdateProduct";
import Sidebar from "./SideBar.jsx"
import ErrorBoundary from "./ErrorBoundary"
import ProtectedRoute from "./ProtectedRoute"
import LogOut from "./LogOut"
import ConfirmMessage from "./confirmMessage"
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
    <div className="flex">
    <ErrorBoundary>
    <Sidebar />
    <div className="ml-2 w-full">
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      
      <Route path="/products" element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
      <Route path="/purchases" element={<ProtectedRoute><Purchases /></ProtectedRoute>} />
      <Route path="/sales" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
      <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
      <Route path="/addproduct" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
      <Route path="/updateproduct" element={<ProtectedRoute><UpdateProduct /></ProtectedRoute>} />
      <Route path="/logout" element={<LogOut />} />
      <Route path="/test" element={<ConfirmMessage message="Test Message" />} />
    </Routes>
    </div>
    </ErrorBoundary>
    </div>
  );
}