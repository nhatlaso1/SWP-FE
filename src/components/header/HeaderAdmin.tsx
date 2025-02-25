import React from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Menu, MenuItem } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import "./HeaderAdmin.scss";

interface HeaderAdminProps {
  currentPage: string;
}

const HeaderAdmin: React.FC<HeaderAdminProps> = ({ currentPage }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="header-admin">
      <div className="header-admin__left">
        <img src="/beauty-logo.svg" alt="Admin Logo" className="header-admin__logo" />
        <h2 className="header-admin__page-title">{currentPage}</h2>
      </div>

      <div className="header-admin__right">
        <IconButton onClick={handleOpenMenu} className="header-admin__user-icon">
          <PersonIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          MenuListProps={{ "aria-labelledby": "user-menu-button" }}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </div>
    </header>
  );
};

export default HeaderAdmin;
