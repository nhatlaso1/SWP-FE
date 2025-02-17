import React from "react";

import "./SpecialOffer.scss";
import { Button } from "@mui/material";

const SpecialOffer: React.FC = () => {
  return (
    <div className="special-offer-container">
      <img
        className="special-offer-banner"
        src="/special-offer-banner.png"
        alt="special-offer-banner"
      />

      <div className="special-offer-info">
        <p className="title">Special offers</p>
        <h3 className="discount">Save up to 50%</h3>
        <p className="desc">Mother’s Day is coming!</p>
        <p className="desc">
          For everything she’s given you, it's time to give back. Shower her
          with love, happiness, and the best of Beautya.
        </p>
        <p className="sub-title">
          Visit your local beautya branches to find out more about our special
          offers in make up and skincare products.
        </p>

        <Button
          color="primary"
          variant="contained"
          fullWidth
          type="submit"
          style={{
            marginTop: "16px",
            color: "white",
            background: "#fd5353",
          }}
        >
          Find Branches
        </Button>
      </div>
    </div>
  );
};

export default SpecialOffer;
