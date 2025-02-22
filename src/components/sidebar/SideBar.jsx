import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import "./SideBar.css";

const NAVIGATION = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    segment: "dashboard",
    title: "Userdetail",
    icon: <DashboardIcon />,
    navigate: "/admin/dashboard",
  },
  {
    segment: "dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
    navigate: "/admin/dashboard",
  },
  {
    segment: "orders",
    title: "Orders",
    icon: <ShoppingCartIcon />,
    navigate: "/admin/orderpage",
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Analytics",
  },
  {
    segment: "question",
    title: "Question",
    icon: <BarChartIcon />,
    navigate: "/admin/updateskintest",
  },
  {
    segment: "integrations",
    title: "Skin Question",
    icon: <LayersIcon />,
    navigate: "/admin/skintest",
  },
  {
    segment: "integrations",
    title: "All Skin Question",
    icon: <LayersIcon />,
    navigate: "/admin/allskintest",
  },
];

export default function Sidebar({ onPageChange }) {
  const navigate = useNavigate(); // Điều hướng

  const handlePageChange = (title) => {
    if (onPageChange) {
      onPageChange(title);
    }
  };

  return (
    <div className="sidebar">
      <h2>Sidebar</h2>
      {NAVIGATION.map((item, index) => (
        <div
          key={index}
          onClick={() => {
            if (item.navigate) {
              navigate(item.navigate);
              handlePageChange(item.title);
            }
          }}
          className="sidebar-item"
        >
          {item.icon} <span className="sidebar-title">{item.title}</span>
        </div>
      ))}
    </div>
  );
}
