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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function SalesChart() {
  const [chartData, setChartData] = useState(null);
  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7) // YYYY-MM
  );

  useEffect(() => {
    async function loadData() {
      try {
        const res = await apiGet("/api/sales");

        const grouped = {};

        res.results.forEach((sale) => {
          const d = new Date(sale.date);

          const saleMonth =
            d.getFullYear() +
            "-" +
            String(d.getMonth() + 1).padStart(2, "0");

          // ✅ filter by selected month
          if (saleMonth !== month) return;

          const day = String(d.getDate()).padStart(2, "0");

          grouped[day] = (grouped[day] || 0) + Number(sale.total || 0);
        });

        // 🔹 fill missing days (important for smooth chart)
        const daysInMonth = new Date(
          month.split("-")[0],
          month.split("-")[1],
          0
        ).getDate();

        const labels = [];
        const values = [];

        for (let i = 1; i <= daysInMonth; i++) {
          const d = String(i).padStart(2, "0");
          labels.push(d);
          values.push(grouped[d] || 0);
        }

        setChartData({
          labels,
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
  }, [month]);

  if (!chartData) return <p>Loading chart...</p>;

  return (
    
      
      <div className="flex flex-col w-fit h-80 justify-center items-center rounded-2xl shadow-xl p-8">
        <div className="flex w-full justify-between items-center mb-4 gap-6">
          <h2 className="text-xl font-bold">📈 Sales Overview</h2>

          {/* Month Picker */}
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border p-2 rounded-lg"
          />
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