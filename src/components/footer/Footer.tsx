import React from "react";

import "./Footer.scss";
import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="proposition-container">
        <div>
          <img src="/icons/proposition-ico-1.svg" alt="" />
          <p>No tests on animals</p>
        </div>
        <div>
          <img src="/icons/proposition-ico-2.svg" alt="" />
          <p>No animal-derived ingredients</p>
        </div>
        <div>
          <img src="/icons/proposition-ico-3.svg" alt="" />
          <p>No gluten, or gluten byproducts</p>
        </div>
        <div>
          <img src="/icons/proposition-ico-4.svg" alt="" />
          <p>Recyclable packaging</p>
        </div>
      </div>

      <div className="footer-info">
        <img className="footer-bg" src="/footer-bg.svg" alt="" />

        <div className="section-1">
          <h3>How can we Help?</h3>

          <a>Beautya Branches</a>
          <a>Contact Us</a>
          <a>FAQ</a>
          <a>Our Brand</a>
          <a>Blog</a>
        </div>

        <div className="section-2">
          <h3>Products</h3>

          <a>Women Make up</a>
          <a>Women Skincare</a>
          <a>Gifts & Sets</a>
        </div>

        <div className="section-3">
          <h3>Keep In Touch With Beautya</h3>

          <p>
            Join the Beautya newsletter and be first to hear about news, offers
            and skincare advice
          </p>

          <div className="subscribe">
            <TextField
              id="email-address"
              label="Email Address"
              variant="standard"
            />

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
              Subscribe
            </Button>
          </div>

          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="By submitting your email, you agree to receive advertising emails from Beautya. Please review our Privacy Policy, which includes our Financial Incentive Notice for CA residents."
          />
        </div>
      </div>

      <div className="location">
        <div className="location-info">
          <div>
            <img src="/icons/location-ico.svg" alt="" />
            <p>Dr. Richardson, California</p>
          </div>
          |
          <div>
            <img src="/icons/call-icon.svg" alt="" />
            <p>1-802-526-2463</p>
          </div>
        </div>

        <div className="socials">
          <img src="/icons/instagram-icon.svg" alt="" />
          <img src="/icons/facebook-icon.svg" alt="" />
          <img src="/icons/twitter-icon.svg" alt="" />
          <img src="/icons/pinterest-icon.svg" alt="" />
          <img src="/icons/tiktok-icon.svg" alt="" />
        </div>
      </div>

      <div className="copyright">
        <p>© 2023 Beautya. All Rights Reserved.</p>

        <div>
          <p>Terms & Conditions</p>
          <p>Privacy Policy</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
