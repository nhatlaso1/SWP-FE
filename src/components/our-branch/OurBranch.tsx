import React from "react";

import "./OurBranch.scss";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
const OurBranch: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/brands");
  };
  return (
    <div className="our-branch-container">
      <div className="our-branch-info">
        <p className="title">Our Brand</p>
        <p className="sub-title">
          We believe that beauty thrives in diversity and discovery. Our purpose
          is to expand the way the world sees beauty by empowering the
          Extraordinary in each of us.
        </p>
        <Button
          variant="outlined"
          fullWidth
          type="submit"
          style={{
            width: "fit-content",
            padding: "12px 24px",
            marginTop: "16px",
            color: "white",
            borderColor: "white",
          }}
          onClick={handleClick}
        >
          Discover More
        </Button>
      </div>

      <img
        className="our-branch-banner"
        src="/our-branch-banner.png"
        alt="our-branch-banner"
      />
    </div>
  );
};

export default OurBranch;
