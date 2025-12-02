import { NavLink ,useNavigate} from "react-router-dom";
import { LayoutDashboard , Package, ShoppingCart, Receipt, Menu ,LogOut,PackageOpen } from "lucide-react";
import { useState } from "react";
export default function Sidebar() {
  const [open, setOpen] = useState(true);
  return (
    
    <div className={`h-screen bg-gray-900 text-white p-4 transition-all duration-300
      ${open ? "w-64 fixed left-0 top-0 z-50" : "w-20 relative"}`}>
      
      {/* Top */}
      <div className="flex items-center justify-between mb-10">
      {open &&
        <h1 className={`text-2xl font-bold`}>
          My App
        </h1>
       }
        <button onClick={() => setOpen(!open)}>
          <Menu size={28} className="text-white" />
        </button>
      </div>

      {/* Links */}
      <div className="flex flex-col  gap-4">
       <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition
            ${isActive ? "bg-gray-700" : "hover:bg-gray-800"}`
          }
        >
          <LayoutDashboard size={22} />
          {open && <span>Dashboard</span>}
        </NavLink>
        
        
        <NavLink
          to="/products"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition
            ${isActive ? "bg-gray-700" : "hover:bg-gray-800"}`
          }
        >
          <Package size={22} />
          {open && <span>Products</span>}
        </NavLink>

        <NavLink
          to="/sales"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition
            ${isActive ? "bg-gray-700" : "hover:bg-gray-800"}`
          }
        >
          <ShoppingCart size={22} />
          {open && <span>Sales</span>}
        </NavLink>

        <NavLink
          to="/purchases"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition
            ${isActive ? "bg-gray-700" : "hover:bg-gray-800"}`
          }
        >
          <PackageOpen size={22} />
          {open && <span>Purchases</span>}
        </NavLink>

        <NavLink
          to="/transactions"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition
            ${isActive ? "bg-gray-700" : "hover:bg-gray-800"}`
          }
        >
          <Receipt size={22} />
          {open && <span>Transactions</span>}
        </NavLink>
     <NavLink
          to="/logout"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition
            ${isActive ? "bg-gray-700" : "hover:bg-gray-800"}`
          }
        >
          <LogOut size={22} />
          {open && <span>LogOut</span>}
        </NavLink>
      </div>
    </div>
  );
}