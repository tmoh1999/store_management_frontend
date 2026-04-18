import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { apiGet } from "../api";
import SalesChart from "../components/SalesChart";
export default function Dashboard() {
  const location = useLocation();
  const username = localStorage.getItem("username");
  const [stats, setStats] = useState({
    products: 0,
    sales: 0,
    purchases: 0,
    transactions: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const [products, sales, purchases, transactions] = await Promise.all([
          apiGet("/api/products"),
          apiGet("/api/sales"),
          apiGet("/api/purchases"),
          apiGet("/api/transactions"),
        ]);

        setStats({
          products: products.results.length,
          sales: sales.results.length,
          purchases: purchases.results.length,
          transactions: transactions.results.length,
        });
      } catch (err) {
        console.log(err);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-4">
        Store Dashboard
      </h1>

      <h2 className="text-center text-lg mb-6">
        User: {username}
      </h2>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-500 text-white p-4 rounded-xl text-center">
          <h3 className="text-xl">Products</h3>
          <p className="text-2xl font-bold">{stats.products}</p>
        </div>

        <div className="bg-green-500 text-white p-4 rounded-xl text-center">
          <h3 className="text-xl">Sales</h3>
          <p className="text-2xl font-bold">{stats.sales}</p>
        </div>

        <div className="bg-yellow-500 text-white p-4 rounded-xl text-center">
          <h3 className="text-xl">Purchases</h3>
          <p className="text-2xl font-bold">{stats.purchases}</p>
        </div>

        <div className="bg-purple-500 text-white p-4 rounded-xl text-center">
          <h3 className="text-xl">Transactions</h3>
          <p className="text-2xl font-bold">{stats.transactions}</p>
        </div>
      </div>
      {/* Sales Chart */}
      <SalesChart />
      {/* Navigation
      <div className="flex flex-col items-center gap-4">
        <Link to="/products" className="btn">📦 Products</Link>
        <Link to="/sales" className="btn">💰 Sales</Link>
        <Link to="/purchases" className="btn">🛒 Purchases</Link>
        <Link to="/transactions" className="btn">📊 Transactions</Link>
        <Link to="/suppliers" className="btn">🏢 Suppliers</Link>
      </div> */}
    </div>
  );
}