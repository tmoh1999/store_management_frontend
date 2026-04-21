import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { apiGet } from "../api";
import SalesChart from "../components/SalesChart";
import { getDatasetAtEvent } from "react-chartjs-2";
export default function Dashboard() {
  const location = useLocation();
  const username = localStorage.getItem("username");
  const [stats, setStats] = useState({
    low_stock_products: [],
    top_saled_products: [],
    total_purchases: 0,
    total_revenue: 0,
  });
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};  
const getMonthRange = () => {
  const now = new Date();

  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return {
    start_date: formatDate(start),
    end_date: formatDate(end),
  };
};

const [dateRange, setDateRange] = useState(getMonthRange()); 
  useEffect(() => {
    async function loadStats() {
      try {
        const [products, sales, purchases, transactions] = await Promise.all([
          apiGet("/api/products"),
          apiGet("/api/sales/stats",{start_date:dateRange.start_date,end_date:dateRange.end_date}),
          apiGet("/api/purchases/stats",{start_date:dateRange.start_date,end_date:dateRange.end_date}),
          apiGet("/api/transactions"),
        ]);

        setStats({
          low_stock_products: purchases.low_stock_products,
          top_saled_products: sales.top_saled_products,
          total_purchases: purchases.total_purchases,
          total_revenue: sales.total_revenue,
        });
      } catch (err) {
        console.log(err);
      }
    }

    loadStats();
  }, [dateRange]);
  const handleChange= (e)=>{
      const x=e.target;
      setDateRange(prev =>({
          ...prev,
          [x.name]:x.value
      }));
  };
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-4">
        Store Dashboard
      </h1>

      <h2 className="text-start font-semibold text-3xl underline px-8 mb-6">
        User: {username}
      </h2>
      <div className="flex justify-center mb-3 mt-7">
        <div>
            <label htmlFor="start_date" className="text-2xl font-medium mr-3">Start:</label>
            <input type="date" id="start_date" name="start_date" 
            className="bg-blue-400 text-xl p-1 rounded-xl shadow-lg text-center font-medium" 
            value={dateRange.start_date} onChange={handleChange}/>
        </div>
        <div className="ml-8">
              <label htmlFor="end_date" className="text-2xl font-medium mr-3">End:</label>
            <input type="date" id="end_date" name="end_date"
            className="bg-blue-400 text-xl p-1 rounded-xl shadow-lg text-center font-medium"
            value={dateRange.end_date} onChange={handleChange}/>
        </div>
      </div>
      {/* Stats */}
      <div className="flex justify-center gap-8 mb-8 ">
        <div className="bg-blue-500 text-white p-4 rounded-xl text-center w-1/6">
          <h3 className="text-xl">Total Revenue</h3>
          <p className="text-2xl font-bold">{stats.total_revenue}</p>
        </div>

        <div className="bg-green-500 text-white p-4 rounded-xl text-center w-1/6">
          <h3 className="text-xl">Total Purchases</h3>
          <p className="text-2xl font-bold">{stats.total_purchases}</p>
        </div>

        <div className="bg-yellow-500 text-white p-4 rounded-xl text-center w-1/6">
          <h3 className="text-xl">Expenses</h3>
          <p className="text-2xl font-bold">{stats.total_purchases}</p>
        </div>
      </div>
      <div className="flex justify-center bg-white p-6 rounded-2xl shadow-xl">
        <div className="flex gap-16 justify-between">
        
          {/* Sales Chart */}
         <SalesChart />
          <div className="flex flex-col w-fit h-80 overflow-y-auto justify-center items-center rounded-2xl shadow-xl p-8">
              <h2 className="text-xl font-bold"> Top 5 Saled Products </h2>
              <table className="w-full mt-4 ">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="text-left px-4 py-2">Product Name</th>
                    <th className="text-left px-4 py-2">Times Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.top_saled_products.map((t) => (
                    <tr key={t.id} className="border-b">
                      <td className="text-left px-4 py-2">{t.name}</td>
                      <td className="text-center px-4 py-2">{t.times_sold}</td>
                    </tr>
                  ))}  
                </tbody>
              </table>
          </div>
          <div className="flex flex-col w-fit h-80 overflow-y-auto justify-center items-center rounded-2xl shadow-xl p-8">
              <h2 className="text-xl font-bold"> Low stock Products </h2>
              <table className="w-full mt-4 ">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="text-left px-4 py-2">Product Name</th>
                    <th className="text-left px-4 py-2">Remaining Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.low_stock_products.map((t) => (
                    <tr key={t.id} className="border-b">
                      <td className="text-left px-4 py-2">{t.name}</td>
                      <td className="text-center px-4 py-2">{t.quantity_float}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
        </div> 
      </div>       
    </div>
  );
}