import React from "react";
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
  const barData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Sales ($)",
        data: [1200, 1900, 3000, 5000, 2200, 3200],
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };

  const lineData = {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    datasets: [
      {
        label: "Visitors",
        data: [150, 200, 250, 400, 300],
        borderColor: "rgba(255, 99, 132, 1)",
        fill: false,
      },
    ],
  };

  const pieData = {
    labels: ["Skincare", "Makeup", "Haircare"],
    datasets: [
      {
        data: [300, 500, 200],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const doughnutData = {
    labels: ["Completed Orders", "Pending Orders", "Cancelled Orders"],
    datasets: [
      {
        data: [250, 50, 30],
        backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
      },
    ],
  };

  return (
    <div className="dashboard-container">
      {/* Highlight Cards */}
      <div className="highlight-container">
        <div className="highlight-card">
          <h3>Total Revenue</h3>
          <p>$15,200</p>
        </div>

        <div className="highlight-card">
          <h3>Orders</h3>
          <p>320</p>
        </div>

        <div className="highlight-card">
          <h3>Customers</h3>
          <p>1,200</p>
        </div>

        <div className="highlight-card">
          <h3>Products</h3>
          <p>85</p>
        </div>
      </div>

      {/* Charts */}
      <div className="chart-grid">
        <div className="chart-card">
          <h2 className="chart-title">Sales Overview</h2>
          <Bar data={barData} />
        </div>

        <div className="chart-card">
          <h2 className="chart-title">Visitor Statistics</h2>
          <Line data={lineData} />
        </div>

        <div className="chart-card">
          <h2 className="chart-title">Product Categories</h2>
          <Pie data={pieData} />
        </div>

        <div className="chart-card">
          <h2 className="chart-title">Order Status</h2>
          <Doughnut data={doughnutData} />
        </div>
      </div>
    </div>
  );
}
