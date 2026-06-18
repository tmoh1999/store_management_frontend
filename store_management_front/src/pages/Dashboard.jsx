import { useEffect, useState } from "react";
import { apiGet } from "../api";
import SalesChart from "../components/SalesChart";
import { getMonthRange } from "../utils";
export default function Dashboard() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const username = localStorage.getItem("username");
  const [stats, setStats] = useState({
    low_stock_products: [],
    top_saled_products: [],
    total_purchases: 0,
    total_revenue: 0,
    total_expenses: 0,
  });

const [dateRange, setDateRange] = useState(getMonthRange()); 
  useEffect(() => {
    async function loadStats() {
      try {
        const [products, sales, purchases, transactions] = await Promise.all([
          apiGet("/api/products"),
          apiGet("/api/sales/stats",{start_date:dateRange.start_date,end_date:dateRange.end_date}),
          apiGet("/api/purchases/stats",{start_date:dateRange.start_date,end_date:dateRange.end_date}),
          apiGet("/api/transactions/stats",{start_date:dateRange.start_date,end_date:dateRange.end_date}),
        ]);

        if(!products?.success){
          setError(products?.message || "API ERROR:products");
        }
        if(!purchases?.success){
          setError(purchases?.message || "API ERROR:purchases");
        }
        if(!sales?.success){
          setError(sales?.message || "API ERROR:sales");
        }     
        if(!transactions?.success){
          setError(transactions?.message || "API ERROR:transactions");
        }             
      setStats(prev => ({
        ...prev,

        low_stock_products: purchases?.success
          ? purchases.low_stock_products
          : prev.low_stock_products,

        top_saled_products: sales?.success
          ? sales.top_saled_products
          : prev.top_saled_products,

        total_purchases: purchases?.success
          ? purchases.total_purchases
          : prev.total_purchases,

        total_revenue: sales?.success
          ? sales.total_revenue
          : prev.total_revenue,

        total_expenses: transactions?.success
          ? transactions.total_expenses
            : prev.total_expenses,
      }));
      } catch (err) {
        setError(err?.message || "API ERROR");
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
  <div className="flex flex-col bg-slate-300 items-center p-2 sm:p-6 min-w-[600px]  w-full sm:w-full ">
      <h1 className="text-3xl w-full  font-bold text-center mb-4">
        Store Dashboard
      </h1>

      <h2 className="  w-full text-start px-2 sm:px-8 font-semibold  text-3xl underline  mb-6">
        User: {username}
      </h2>
      {error && (
          <div className="bg-red-100  p-2 rounded mb-3">
              {error}
              <button onClick={() => setError("")} className="ml-3 font-bold">✕</button>
          </div>
      )  
      }

      <div className="flex flex-col gap-5 w-full sm:w-fit sm:gap-3 sm:flex-row  items-center justify-center mb-3 mt-7">
        <div>
            <label htmlFor="start_date" className="text-2xl font-medium mr-3">Start:</label>
            <input type="date" id="start_date" name="start_date" 
            className="bg-blue-400 text-xl p-1 rounded-xl shadow-lg text-center font-medium" 
            value={dateRange.start_date} onChange={handleChange}/>
        </div>
        <div className="ml-0 sm:ml-8">
              <label htmlFor="end_date" className="text-2xl font-medium mr-3">End:</label>
            <input type="date" id="end_date" name="end_date"
            className="bg-blue-400 text-xl p-1 rounded-xl shadow-lg text-center font-medium"
            value={dateRange.end_date} onChange={handleChange}/>
        </div>
      </div>
      <div className="flex  w-48 sm:w-full flex-col sm:flex-row items-center sm:justify-center gap-3 sm:gap-6 mb-2 mt-8 ">
        <div className="bg-blue-500 text-white p-2 rounded-xl text-center sm:min-w-fit w-full sm:w-1/6">
          <h3 className="text-xl">Total Revenue</h3>
          <p className="text-2xl font-bold">{stats.total_revenue}</p>
        </div>

        <div className="bg-green-500 text-white p-2 rounded-xl text-center sm:min-w-fit w-full sm:w-1/6">
          <h3 className="text-xl">Total Purchases</h3>
          <p className="text-2xl font-bold">{stats.total_purchases}</p>
        </div>

        <div className="bg-yellow-500 text-white p-2 rounded-xl text-center sm:min-w-fit w-full sm:w-1/6">
          <h3 className="text-xl">Expenses</h3>
          <p className="text-2xl font-bold">{stats.total_expenses}</p>
        </div>
      </div>
      <div className="">
        <div className="flex flex-col  p-3   w-80 sm:w-full lg:flex-row gap-5 items-center lg:justify-between">
        
         <SalesChart dateRange={dateRange}/>
          <div className="flex flex-col justify-center    sm:flex-row gap-5">
            <div className="flex flex-col bg-white w-full sm:w-64 h-80 overflow-y-auto justify-center items-center rounded-2xl shadow-xl p-2 sm:p-4">
                <h2 className="text-xl font-bold w-full text-center"> Top 5 Saled Products </h2>
                <table className="mt-4 ">
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
            <div className="flex flex-col bg-white w-full sm:w-64 h-80 overflow-y-auto justify-center items-center rounded-2xl shadow-xl p-2 sm:p-4">
                <h2 className="text-xl font-bold"> Low stock Products </h2>
                <table className="mt-4 ">
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
  </div>
  );
}