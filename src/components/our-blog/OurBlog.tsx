import React from "react";
import Carousel from "react-multi-carousel";

import "./OurBlog.scss";

const OurBlog: React.FC = () => {
  return (
    <div className="our-blog-container">
      <h2 className="title">Our Blog</h2>

      <div className="our-blog-list">
        <Carousel
          additionalTransfrom={0}
          arrows
          autoPlaySpeed={3000}
          centerMode={false}
          className=""
          containerClass="container-with-dots"
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
              items: 3,
              partialVisibilityGutter: 40,
            },
            mobile: {
              breakpoint: {
                max: 464,
                min: 0,
              },
              items: 1,
              partialVisibilityGutter: 30,
            },
            tablet: {
              breakpoint: {
                max: 1024,
                min: 464,
              },
              items: 2,
              partialVisibilityGutter: 30,
            },
          }}
          rewind={false}
          rewindWithAnimation={false}
          rtl={false}
          shouldResetAutoplay
          showDots={false}
          sliderClass=""
          slidesToSlide={1}
          swipeable
        >
          <div className="blog-item">
            <img src="/blog-1.png" alt="category-item" />
            <div className="blog-info">
              <p className="name">How to get clear skin fast</p>
              <p className="sub-title">
                <span>Skincare</span>|<span>Skincare</span>|
                <span>Skincare</span>
              </p>
              <p className="desc">
                Plumping Gloss - Instant and Long-Term Volume Effect - 24h
                Hydration
              </p>
            </div>
          </div>
          <div className="blog-item">
            <img src="/blog-2.png" alt="category-item" />
            <div className="blog-info">
              <p className="name">How to get clear skin fast</p>
              <p className="sub-title">
                <span>Skincare</span>|<span>Skincare</span>|
                <span>Skincare</span>
              </p>
              <p className="desc">
                Plumping Gloss - Instant and Long-Term Volume Effect - 24h
                Hydration
              </p>
            </div>
          </div>
          <div className="blog-item">
            <img src="/blog-3.png" alt="category-item" />
            <div className="blog-info">
              <p className="name">How to get clear skin fast</p>
              <p className="sub-title">
                <span>Skincare</span>|<span>Skincare</span>|
                <span>Skincare</span>
              </p>
              <p className="desc">
                Plumping Gloss - Instant and Long-Term Volume Effect - 24h
                Hydration
              </p>
            </div>
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default OurBlog;
