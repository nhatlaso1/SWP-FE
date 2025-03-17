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
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import "./DashboardStaff.css";
import { getDashboardData } from "../../../store/apiDashboard";

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

export default function DashboardStaff() {
  const [dashboardData, setDashboardData] = useState({
    revenue: 0,
    orders: 0,
    customers: 0,
    products: 0,
    revenueHistory: [],
    orderHistory: [],
    customerHistory: [],
    productHistory: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getDashboardData();
        // Giả lập dữ liệu lịch sử cho 6 tháng
        const months = ["January", "February", "March", "April", "May", "June"];
        const revenueHistory = months.map(() => Math.floor(Math.random() * data.revenue));
        const orderHistory = months.map(() => Math.floor(Math.random() * data.orders));
        const customerHistory = months.map(() => Math.floor(Math.random() * data.customers));
        const productHistory = months.map(() => Math.floor(Math.random() * data.products));

        setDashboardData({
          ...data,
          revenueHistory,
          orderHistory,
          customerHistory,
          productHistory
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const barData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Monthly Revenue ($)",
        data: dashboardData.revenueHistory,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };

  const lineData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Monthly Orders",
        data: dashboardData.orderHistory,
        borderColor: "rgba(255, 99, 132, 1)",
        fill: false,
      },
    ],
  };

  const pieData = {
    labels: ["Active Customers", "New Customers"],
    datasets: [
      {
        data: [
          Math.floor(dashboardData.customers * 0.7),
          Math.floor(dashboardData.customers * 0.3)
        ],
        backgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  const doughnutData = {
    labels: ["Active Products", "Out of Stock", "Low Stock"],
    datasets: [
      {
        data: [
          Math.floor(dashboardData.products * 0.6),
          Math.floor(dashboardData.products * 0.2),
          Math.floor(dashboardData.products * 0.2)
        ],
        backgroundColor: ["#4caf50", "#f44336", "#ff9800"],
      },
    ],
  };

  return (
    <div className="dashboard-container">
      {/* Highlight Cards */}
      <div className="highlight-container">
        <div className="highlight-card">
          <h3>Total Revenue</h3>
          <p>${dashboardData.revenue?.toLocaleString() || '0'}</p>
        </div>

        <div className="highlight-card">
          <h3>Orders</h3>
          <p>{dashboardData.orders?.toLocaleString() || '0'}</p>
        </div>

        <div className="highlight-card">
          <h3>Customers</h3>
          <p>{dashboardData.customers?.toLocaleString() || '0'}</p>
        </div>

        <div className="highlight-card">
          <h3>Products</h3>
          <p>{dashboardData.products?.toLocaleString() || '0'}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="chart-grid">
        <div className="chart-card">
          <h2 className="chart-title">Revenue Trends</h2>
          <Bar data={barData} />
        </div>

        <div className="chart-card">
          <h2 className="chart-title">Order Trends</h2>
          <Line data={lineData} />
        </div>

        <div className="chart-card">
          <h2 className="chart-title">Customer Distribution</h2>
          <Pie data={pieData} />
        </div>

        <div className="chart-card">
          <h2 className="chart-title">Product Status</h2>
          <Doughnut data={doughnutData} />
        </div>
      </div>
    </div>
  );
}
