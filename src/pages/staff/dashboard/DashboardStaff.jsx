import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { getDashboardData, getRevenueByMonth, getRevenueByYearRange } from "../../../store/apiDashboard";

// Đăng ký các thành phần cho Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const yearColors = [
  "rgba(255, 99, 132, 0.5)", // Year 1
  "rgba(54, 162, 235, 0.5)", // Year 2
  "rgba(255, 206, 86, 0.5)", // Year 3
  "rgba(75, 192, 192, 0.5)", // Year 4
  "rgba(153, 102, 255, 0.5)"  // Year 5
];

export default function DashboardStaff() {
  const [dashboardData, setDashboardData] = useState({
    revenue: 0,
    orders: 0,
    customers: 0,
    products: 0,
    orderHistory: [],
    customerHistory: [],
    productHistory: []
  });

  const [revenueData, setRevenueData] = useState({
    monthlyData: [],
    yearlyData: [],
    multiYearData: []
  });

  const [viewMode, setViewMode] = useState('monthly');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getDashboardData();
        const months = ["January", "February", "March", "April", "May", "June"];
        const orderHistory = months.map(() => Math.floor(Math.random() * data.orders));
        const customerHistory = months.map(() => Math.floor(Math.random() * data.customers));
        const productHistory = months.map(() => Math.floor(Math.random() * data.products));

        setDashboardData({
          ...data,
          orderHistory,
          customerHistory,
          productHistory
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    const fetchRevenueData = async () => {
      try {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;

        const monthlyData = await getRevenueByMonth(currentMonth, currentYear);
        const yearlyData = await getRevenueByYearRange(currentYear, currentYear);

        const multiYearData = [];
        for (let year = currentYear - 4; year <= currentYear; year++) {
          const yearData = await getRevenueByYearRange(year, year);
          multiYearData.push(...yearData);
        }

        setRevenueData({
          monthlyData,
          yearlyData,
          multiYearData
        });
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    };

    fetchDashboardData();
    fetchRevenueData();
  }, []);

  const getMonthName = (monthNumber) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[monthNumber - 1];
  };

  let barData;
  if (viewMode === 'multiYear') {
    const multiYearGrouped = {};
    revenueData.multiYearData.forEach(item => {
      const date = new Date(item.date);
      const year = date.getFullYear();
      const month = date.getMonth();
      if (!multiYearGrouped[year]) {
        multiYearGrouped[year] = Array(12).fill(null);
      }
      multiYearGrouped[year][month] = item.revenue;
    });
    const multiYearLabels = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const multiYearDatasets = Object.keys(multiYearGrouped).sort().map((year, index) => ({
      label: `Year ${year}`,
      data: multiYearGrouped[year],
      backgroundColor: yearColors[index % yearColors.length],
    }));

    barData = {
      labels: multiYearLabels,
      datasets: multiYearDatasets
    };
  } else if (viewMode === 'monthly') {
    barData = {
      labels: revenueData.monthlyData.map(item => {
        const date = new Date(item.date);
        return `${date.getDate()} ${getMonthName(date.getMonth() + 1).slice(0, 3)}`;
      }),
      datasets: [{
        label: "Daily Revenue (VND)",
        data: revenueData.monthlyData.map(item => item.revenue),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      }]
    };
  } else if (viewMode === 'yearly') {
    barData = {
      labels: revenueData.yearlyData.map(item => {
        const date = new Date(item.date);
        return getMonthName(date.getMonth() + 1);
      }),
      datasets: [{
        label: "Total Monthly Revenue (VND)",
        data: revenueData.yearlyData.map(item => item.revenue),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      }]
    };
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false, // Biểu đồ tự điều chỉnh theo container
    plugins: {
      legend: {
        position: "top",
        display: viewMode === "multiYear",
        onClick: (e, legendItem, legend) => {
          const index = legendItem.datasetIndex;
          const ci = legend.chart;
          const meta = ci.getDatasetMeta(index);
          meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;
          ci.update();
        },
        labels: {
          generateLabels: (chart) => {
            return chart.data.datasets.map((dataset, index) => ({
              text: dataset.label,
              fillStyle: dataset.backgroundColor,
              hidden: chart.getDatasetMeta(index).hidden,
              datasetIndex: index,
            }));
          }
        }
      },
      title: {
        display: true,
        text: viewMode === "monthly"
          ? "Daily Revenue This Month"
          : viewMode === "yearly"
            ? "Total Revenue by Month"
            : "Revenue by Year ",
      },
      tooltip: {
        callbacks: {
          title: (context) => {
            if (viewMode === "yearly") {
              return `${context[0].label} ${new Date().getFullYear()}`;
            } else if (viewMode === "multiYear") {
              return context[0].label;
            }
            return context[0].label;
          },
          label: (context) => {
            const value = context.parsed.y;
            return `Revenue: ${value.toLocaleString()} VND`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value.toLocaleString() + " VND";
          }
        }
      }
    }
  };

  return (
    <div style={{ height: "95vh", overflow: "hidden", display: "flex", flexDirection: "column", padding: "10px", boxSizing: "border-box" }}>
      {/* Highlight Cards */}
      <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", marginBottom: "20px" }}>
        <div style={{ backgroundColor: "#fff", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", flex: 1, margin: "0 10px", textAlign: "center" }}>
          <h3>Total Revenue</h3>
          <p>{dashboardData.revenue?.toLocaleString() || "0"} VND</p>
        </div>
        <div style={{ backgroundColor: "#fff", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", flex: 1, margin: "0 10px", textAlign: "center" }}>
          <h3>Orders</h3>
          <p>{dashboardData.orders?.toLocaleString() || "0"}</p>
        </div>
        <div style={{ backgroundColor: "#fff", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", flex: 1, margin: "0 10px", textAlign: "center" }}>
          <h3>Customers</h3>
          <p>{dashboardData.customers?.toLocaleString() || "0"}</p>
        </div>
        <div style={{ backgroundColor: "#fff", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", flex: 1, margin: "0 10px", textAlign: "center" }}>
          <h3>Products</h3>
          <p>{dashboardData.products?.toLocaleString() || "0"}</p>
        </div>
      </div>

      {/* Charts */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ flex: 1, display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#fff", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 style={{ margin: 0 }}>Revenue Trends</h2>
              <div>
                <button
                  onClick={() => setViewMode("monthly")}
                  style={{
                    padding: "5px 10px",
                    marginRight: "10px",
                    backgroundColor: viewMode === "monthly" ? "#36A2EB" : "#f0f0f0",
                    color: viewMode === "monthly" ? "white" : "black",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Daily View
                </button>
                <button
                  onClick={() => setViewMode("yearly")}
                  style={{
                    padding: "5px 10px",
                    marginRight: "10px",
                    backgroundColor: viewMode === "yearly" ? "#36A2EB" : "#f0f0f0",
                    color: viewMode === "yearly" ? "white" : "black",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Monthly View
                </button>
                <button
                  onClick={() => setViewMode("multiYear")}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: viewMode === "multiYear" ? "#36A2EB" : "#f0f0f0",
                    color: viewMode === "multiYear" ? "white" : "black",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Yearly View
                </button>
              </div>
            </div>
            {/* Wrapper để biểu đồ chiếm toàn bộ không gian có sẵn */}
            <div style={{ flex: 1, position: "relative" }}>
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
