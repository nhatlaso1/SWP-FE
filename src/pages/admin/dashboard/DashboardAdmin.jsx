import React, { useState } from "react";
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
import { Bar, Line, Doughnut, Pie } from "react-chartjs-2";
import * as XLSX from "xlsx";
import "./DashboardAdmin.css";

// Register Chart.js components
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

export default function DashboardAdmin() {
  // State for revenue view toggle (monthly/weekly)
  const [revenueView, setRevenueView] = useState("monthly");
  // State for selected month when in monthly view
  const [selectedMonth, setSelectedMonth] = useState("May");

  // Sample monthly revenue data (6 weeks per month)
  const allMonthlyRevenueData = {
    Jan: [15000, 18000, 14000, 20000, 22000, 19000],
    Feb: [16000, 17000, 15000, 21000, 23000, 19500],
    Mar: [15500, 17500, 14500, 20500, 22500, 19200],
    Apr: [15800, 17800, 14800, 20800, 22800, 19300],
    May: [15000, 18000, 14000, 20000, 22000, 19000],
    Jun: [15200, 18200, 14200, 20200, 22200, 19100],
  };

  // Weekly revenue data
  const weeklyRevenueData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Weekly Revenue ($)",
        data: [3500, 4200, 3800, 5000, 4800, 4500, 4000],
        borderColor: "rgba(153, 102, 255, 1)",
        fill: false,
      },
    ],
  };

  // Monthly revenue data based on selected month
  const monthlyRevenueData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
    datasets: [
      {
        label: `Monthly Revenue for ${selectedMonth} ($)`,
        data: allMonthlyRevenueData[selectedMonth],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  // Other chart data
  const regionRevenueData = {
    labels: ["North", "South", "East", "West"],
    datasets: [
      {
        label: "Revenue by Region",
        data: [40000, 30000, 25000, 35000],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4caf50"],
      },
    ],
  };

  const salesByCategoryData = {
    labels: ["Skincare", "Makeup", "Haircare", "Fragrance"],
    datasets: [
      {
        label: "Sales by Category",
        data: [300, 500, 200, 100],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#66bb6a"],
      },
    ],
  };

  const topProductsData = {
    labels: ["Product A", "Product B", "Product C", "Product D", "Product E"],
    datasets: [
      {
        label: "Top 5 Products",
        data: [1200, 900, 750, 600, 450],
        backgroundColor: "rgba(255, 159, 64, 0.5)",
      },
    ],
  };

  const dailyVisitorsData = {
    labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
    datasets: [
      {
        label: "Daily Visitors",
        data: [50, 150, 300, 450, 400, 200],
        borderColor: "rgba(255, 99, 132, 1)",
        fill: false,
      },
    ],
  };

  // Export Excel functionality using xlsx
  const handleExportExcel = () => {
    // Prepare sample data from dashboard highlights
    const data = [
      { Metric: "Total Revenue", Value: 15200 },
      { Metric: "Orders", Value: 320 },
      { Metric: "Customers", Value: 1200 },
      { Metric: "Products", Value: 85 },
    ];

    // Convert JSON data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dashboard Data");
    // Export the workbook to Excel file and trigger download
    XLSX.writeFile(workbook, "dashboard_data.xlsx");
  };

  // Handlers for view and month change
  const handleViewChange = (view) => {
    setRevenueView(view);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
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

      {/* Revenue Chart Section */}
      <div className="chart-card large-chart">
        <h2 className="chart-title">Revenue</h2>
        <div className="revenue-controls">
          <button
            className={`toggle-btn ${
              revenueView === "monthly" ? "active" : ""
            }`}
            onClick={() => handleViewChange("monthly")}
          >
            Monthly
          </button>
          <button
            className={`toggle-btn ${revenueView === "weekly" ? "active" : ""}`}
            onClick={() => handleViewChange("weekly")}
          >
            Weekly
          </button>
          {revenueView === "monthly" && (
            <select
              className="month-select"
              value={selectedMonth}
              onChange={handleMonthChange}
            >
              {Object.keys(allMonthlyRevenueData).map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          )}
        </div>
        {revenueView === "monthly" ? (
          <Bar data={monthlyRevenueData} />
        ) : (
          <Line data={weeklyRevenueData} />
        )}
        <button className="export-btn" onClick={handleExportExcel}>
          Export Excel
        </button>
      </div>

      {/* Small Summary Charts */}
      <div className="chart-grid">
        <div className="chart-card small-chart">
          <h2 className="chart-title">Revenue by Region</h2>
          <Doughnut data={regionRevenueData} />
          <button className="export-btn" onClick={handleExportExcel}>
            Export Excel
          </button>
        </div>

        <div className="chart-card small-chart">
          <h2 className="chart-title">Sales by Category</h2>
          <Pie data={salesByCategoryData} />
        </div>

        <div className="chart-card small-chart">
          <h2 className="chart-title">Top 5 Products</h2>
          <Bar data={topProductsData} />
        </div>

        <div className="chart-card small-chart">
          <h2 className="chart-title">Daily Visitors</h2>
          <Line data={dailyVisitorsData} />
        </div>
      </div>
    </div>
  );
}
