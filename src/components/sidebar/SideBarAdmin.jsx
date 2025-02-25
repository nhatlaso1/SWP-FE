import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LayersIcon from "@mui/icons-material/Layers";
import "./SideBarAdmin.css";

const NAVIGATION = [
  {
    kind: "header",
    title: "Main items",
  },

  {
    segment: "dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
    navigate: "/admin/dashboard",
  },
  {
    segment: "routines",
    title: "Routines",
    icon: <ShoppingCartIcon />,
    navigate: "/admin/s",
  },
  {
    segment: "skinTest",
    title: "SkinTests",
    icon: <LayersIcon />,
    navigate: "/admin/skintests",
  },
];

export default function SidebarAdmin({ onPageChange }) {
  const navigate = useNavigate(); // Điều hướng

  const handlePageChange = (title) => {
    if (onPageChange) {
      onPageChange(title);
    }
  };

  return (
    <div className="sidebar">
      <h2>BeautySC</h2>
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
