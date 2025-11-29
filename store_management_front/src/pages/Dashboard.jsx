import { Link ,useNavigate,useLocation} from "react-router-dom";
import { useEffect } from "react";
import UploadFile from "../UploadFile"
//import {test} from "../api";
export default function Dashboard() {
	const navigate = useNavigate();
	const location = useLocation();
	const user=location.state;
	console.log(user);
  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-center text-3xl font-bold mb-5">Store Management</h1>
      <h2 className="text-center text-xl font-semibold mb-5">user: {user?.username}</h2>

      <div className="flex flex-col items-center gap-4">
        
        <Link
          to="/products"
          className="w-3/4 p-4 rounded-xl shadow-lg text-white bg-blue-600 text-center text-lg font-medium hover:bg-blue-700"
        >
          📦 Manage Products
        </Link>

        <Link
          to="/addproduct"
          className="w-3/4 p-4 rounded-xl shadow-lg text-white bg-green-600 text-center text-lg font-medium hover:bg-green-700"
        >
          💰 Manage Sales
        </Link>

        <UploadFile apiPath="/tools/restore" fileType=".sql"/>

        {/* Repeat others */}
      </div>
    </div>
  );
} 
