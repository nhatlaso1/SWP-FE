import { Button } from "@mui/material";

import "./Advertisement.scss";

const Advertisement = () => {
  return (
    <div className="advertisement-container">
      <div className="advertisement-info">
        <p className="title">NEW Virtual Skincare Analysis</p>
        <p className="sub-title">
          Looking for a full skincare routine? Our NEW Virtual Skincare Analysis
          Tool evaluates your skin and provides the most personalized
          recommendations.
        </p>
        <div className="scan-qr-wrap">
          <div className="scan-info">
            <b>Scan with your phone to get started</b>
            <p>Or</p>
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
            >
              Answer a few questions
            </Button>
          </div>
          <img src="advertisement-qr-code.png" alt="qr-code" />
        </div>
      </div>
      <img
        className="advertisement-banner"
        src="/advertisement-banner.png"
        alt="advertisement-banner"
      />
    </div>
  );
};

export default Advertisement;
