import React from "react";
import Carousel from "react-multi-carousel";
import { Button } from "@mui/material";

import "./Hero.scss";

const Hero = () => {
  return (
    <div className="hero-container">
      <Carousel
        additionalTransfrom={0}
        arrows
        autoPlaySpeed={3000}
        centerMode={false}
        className=""
        containerClass="container"
        dotListClass=""
        draggable
        focusOnSelect={false}
        infinite
        itemClass=""
        keyBoardControl
        minimumTouchDrag={80}
        pauseOnHover
        renderArrowsWhenDisabled={false}
        renderButtonGroupOutside={false}
        renderDotsOutside={false}
        responsive={{
          desktop: {
            breakpoint: {
              max: 3000,
              min: 1024,
            },
            items: 1,
          },
          mobile: {
            breakpoint: {
              max: 464,
              min: 0,
            },
            items: 1,
          },
          tablet: {
            breakpoint: {
              max: 1024,
              min: 464,
            },
            items: 1,
          },
        }}
        rewind={false}
        rewindWithAnimation={false}
        rtl={false}
        shouldResetAutoplay
        showDots
        sliderClass=""
        slidesToSlide={1}
        swipeable
      >
        <div className="hero-item">
          <img src="/hero-banner-1.png" alt="hero-banner" />

          <div className="hero-content">
            <p className="title">Unlock Your True Beauty</p>
            <Button variant="outlined">Know More</Button>
          </div>
        </div>
        <div className="hero-item">
          <img src="/hero-banner-2.png" alt="hero-banner" />

          <div className="hero-content">
            <p className="title">Unlock Your True Beauty</p>
            <Button variant="outlined">Know More</Button>
          </div>
        </div>
        <div className="hero-item">
          <img src="/hero-banner-3.png" alt="hero-banner" />

          <div className="hero-content">
            <p className="title">Unlock Your True Beauty</p>
            <Button variant="outlined">Know More</Button>
          </div>
        </div>
        <div className="hero-item">
          <img src="/hero-banner-4.png" alt="hero-banner" />

          <div className="hero-content">
            <p className="title">Unlock Your True Beauty</p>
            <Button variant="outlined">Know More</Button>
          </div>
        </div>
      </Carousel>
    </div>
  );
};

export default Hero;
