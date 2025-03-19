import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CategoryIcon from "@mui/icons-material/Category";
import LayersIcon from "@mui/icons-material/Layers";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import "./SideBarStaff.css";

const NAVIGATION = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    segment: "dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
    navigate: "/staff/dashboard",
  },
  {
    segment: "orders",
    title: "Orders",
    icon: <ShoppingCartIcon />,
    navigate: "/staff/orders",
  },
  {
    segment: "categories",
    title: "Categories",
    icon: <CategoryIcon />,
    navigate: "/staff/categories",
  },
  {
    segment: "products",
    title: "Products",
    icon: <LayersIcon />,
    navigate: "/staff/products",
  },
  {
    segment: "brands",
    title: "Brands",
    icon: <BrandingWatermarkIcon />,
    navigate: "/staff/brands",
  },
];

export default function SidebarStaff({ onPageChange }) {
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
