import { Link } from "react-router-dom";

export default function Dashboard({ username }) {
  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-center text-3xl font-bold mb-5">Store Management</h1>
      <h2 className="text-center text-xl font-semibold mb-5">user: {username}</h2>

      <div className="flex flex-col items-center gap-4">
        
        <Link
          to="/products/manageproducts"
          className="w-3/4 p-4 rounded-xl shadow-lg text-white bg-blue-600 text-center text-lg font-medium hover:bg-blue-700"
        >
          📦 Manage Products
        </Link>

        <Link
          to="/sales/managesales"
          className="w-3/4 p-4 rounded-xl shadow-lg text-white bg-green-600 text-center text-lg font-medium hover:bg-green-700"
        >
          💰 Manage Sales
        </Link>

        {/* Repeat others */}
      </div>
    </div>
  );
}