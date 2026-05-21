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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function SalesChart({dateRange=null}) {
  const [chartData, setChartData] = useState(null);
  useEffect(() => {
    async function loadData() {
      try {
        const op={
            start_date:dateRange.start_date,
            end_date:dateRange.end_date,
        };
        const res = await apiGet("/api/sales",op);

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
          console.log("ss0......"+d+"....."+grouped[d]);
          values.push(grouped[d] || 0);
        }
       
        setChartData({
          uniqueLabels,
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
        console.log(err);
      }
    }

    loadData();
  }, [dateRange]);

  if (!chartData) return <p>Loading chart...</p>;

  return (
    
      
      <div className="flex flex-col w-fit h-80 justify-center items-center rounded-2xl shadow-xl p-8">
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
                        labels: chartData.uniqueLabels,
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
      
   
  );
}