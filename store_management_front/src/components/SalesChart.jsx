import { useEffect, useState } from "react";
import { apiGet } from "../api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { formatDate, getMonthRange } from "../utils";
import NoDataFound from "./NoDataFound";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function SalesChart({dateRange=getMonthRange()}) {
  const [chartData, setChartData] = useState({
    labels:[],
    datasets:[]
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function loadData() {
      setError("");
      setLoading(true);
      try {

        const op={
            start_date:dateRange.start_date,
            end_date:dateRange.end_date,
        };

        const res = await apiGet("/api/sales",op);
        
        if(!res?.success){
          setError(res.message || "API ERROR");
          return;
        }

        const grouped = {};

        const labels = [];
        const values = [];
        res.results.forEach((sale) => {
          const d = formatDate(new Date(sale.date));
          labels.push(d);
          grouped[d] = (grouped[d] || 0) + Number(sale.total || 0);
        });
        const uniqueLabels = [...new Set(labels)].sort((a, b) => new Date(a) - new Date(b));
        for(let d of uniqueLabels){
          values.push(grouped[d] || 0);
        }
       
        setChartData({
          labels:uniqueLabels,
          datasets: [
            {
                label: "Daily Sales",
                data: values,
                borderColor: "#3b82f6",        // line color (blue-500)
                backgroundColor: "rgba(59,130,246,0.2)", // area fill

                pointBackgroundColor: "#3b82f6",
                pointBorderColor: "#fff",
                pointHoverRadius: 6,

                tension: 0.4, // smooth curve
                fill: true,
            },
          ],
        });
      } catch (err) {
        setError(err.message);
      }finally{

        setLoading(false);
        
      };
    }

    loadData();


    
  }, [dateRange]);


  return (
    
      
    <>  
        {loading?(
          <div className="flex flex-col w-1/4 justify-center items-center bg-gray-300">  
              <div className="w-5/6">
                  <NoDataFound message="Loading Chart..."/>
              </div>
          </div>
        ):error? (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-3">
              {error}
              <button onClick={() => setError("")} className="ml-3 font-bold">✕</button>
          </div>
        ):(
        <div className="flex flex-col w-fit h-80 justify-center items-center rounded-2xl bg-white shadow-xl p-8">
          <div className="flex w-full justify-between items-center mb-4 gap-6">
            <h2 className="text-xl font-bold">📈 Sales Overview</h2>
          </div>
          <Line
              data={chartData}
              options={{
                  responsive: true,
                  plugins: {
                      legend: { display: false },
                  },
                  scales: {
                      x: {
                          labels: chartData.labels,
                          grid: {
                              display: false, // cleaner look
                          },
                      },
                      y: {
                          beginAtZero: true,
                          grid: {
                              color: "rgba(0,0,0,0.05)", // soft grid
                          },
                      },
                  },
              }}
          />
        </div> 
        )}
    </>      
  );
}