import React from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Menu, MenuItem } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import "./HeaderStaff.scss";
import { useStore } from "../../store";

interface HeaderStaffProps {
  currentPage: string;
}

const HeaderStaff: React.FC<HeaderStaffProps> = ({ currentPage }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const logout = useStore((store) => store.logout);

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <header className="header-staff">
      <div className="header-staff__left">
        <img src="/beauty-logo.svg" alt="staff Logo" className="header-staff__logo" />
        <h2 className="header-staff__page-title">{currentPage}</h2>
      </div>

      <div className="header-staff__right">
        <IconButton onClick={handleOpenMenu} className="header-staff__user-icon">
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

export default HeaderStaff;
