import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import QuizIcon from "@mui/icons-material/Quiz";
import RouteIcon from "@mui/icons-material/Route";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import CategoryIcon from "@mui/icons-material/Category";
import LayersIcon from "@mui/icons-material/Layers";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
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
    segment: "users",
    title: "Users",
    icon: <PersonIcon />,
    navigate: "/admin/users",
  },
  {
    segment: "vouchers",
    title: "Vouchers",
    icon: <CardGiftcardIcon />,
    navigate: "/admin/vouchers",
  },
  {
    segment: "skintypes",
    title: "Skintypes",
    icon: <AddReactionIcon />,
    navigate: "/admin/skintypes",
  },
  {
    segment: "routines",
    title: "Routines",
    icon: <RouteIcon />,
    navigate: "/admin/routines",
  },
  {
    segment: "skinTest",
    title: "SkinTests",
    icon: <QuizIcon />,
    navigate: "/admin/skintests",
  },
  
  {
    segment: "categories",
    title: "Categories",
    icon: <CategoryIcon />,
    navigate: "/admin/categories",
  },
  {
    segment: "products",
    title: "Products",
    icon: <LayersIcon />,
    navigate: "/admin/products",
  },
  {
    segment: "brands",
    title: "Brands",
    icon: <BrandingWatermarkIcon />,
    navigate: "/admin/brands",
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
