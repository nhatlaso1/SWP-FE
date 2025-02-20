import Grid from "@mui/material/Grid2";
import { extendTheme, styled } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import LayersIcon from "@mui/icons-material/Layers";
import { useNavigate } from "react-router-dom";

import * as React from "react";
const NAVIGATION = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    segment: "dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
    navigate: "/userDetail",
  },
  {
    segment: "orders",
    title: "Orders",
    icon: <ShoppingCartIcon />,
    navigate: "/user",
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
    navigate: "/question",
  },
  {
    segment: "integrations",
    title: "Create Skin Question",
    icon: <LayersIcon />,
    navigate: "/createSkinQuestion",
  },
];

const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: "class",
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function useDemoRouter(initialPath) {
  const [pathname, setPathname] = React.useState(initialPath);

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  return router;
}

const Skeleton = styled("div")(({ theme, height }) => ({
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  height,
  content: '" "',
}));
export default function Sidebar() {
  const navigate = useNavigate(); // Điều hướng

  return (
    <div
      style={{
        width: "250px",
        background: "#282c34",
        height: "100vh",
        color: "white",
        padding: "10px",
      }}
    >
      <h2>Sidebar</h2>
      {NAVIGATION.map((item, index) => (
        <div
          key={index}
          onClick={() => item.navigate && navigate(item.navigate)}
          style={{
            cursor: "pointer",
            padding: "10px 0",
            display: "flex",
            alignItems: "center",
          }}
        >
          {item.icon} <span style={{ marginLeft: "10px" }}>{item.title}</span>
        </div>
      ))}
    </div>
  );
}
