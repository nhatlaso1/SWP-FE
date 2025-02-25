import React from "react";
import Carousel from "react-multi-carousel";

import "./NewIn.scss";

const NewIn: React.FC = () => {
  return (
    <div className="new-in-container">
      <h2 className="title">New In</h2>

      <div className="new-in-list">
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
              items: 4,
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
          <div className="product-item">
            <img src="/products/product-5.png" alt="category-item" />
            <div className="product-info">
              <p className="name">
                Beautya Capture Total Dreamskin Care & Perfect
              </p>
              <p className="desc">
                Plumping Gloss - Instant and Long-Term Volume Effect - 24h
                Hydration
              </p>
              <p className="price">$76.00</p>
            </div>
          </div>
          <div className="product-item">
            <img src="/products/product-6.png" alt="category-item" />
            <div className="product-info">
              <p className="name">
                Beautya Capture Total Dreamskin Care & Perfect
              </p>
              <p className="desc">
                Plumping Gloss - Instant and Long-Term Volume Effect - 24h
                Hydration
              </p>
              <p className="price">$76.00</p>
            </div>
          </div>
          <div className="product-item">
            <img src="/products/product-7.png" alt="category-item" />
            <div className="product-info">
              <p className="name">
                Beautya Capture Total Dreamskin Care & Perfect
              </p>
              <p className="desc">
                Plumping Gloss - Instant and Long-Term Volume Effect - 24h
                Hydration
              </p>
              <p className="price">$76.00</p>
            </div>
          </div>
          <div className="product-item">
            <img src="/products/product-8.png" alt="category-item" />
            <div className="product-info">
              <p className="name">
                Beautya Capture Total Dreamskin Care & Perfect
              </p>
              <p className="desc">
                Plumping Gloss - Instant and Long-Term Volume Effect - 24h
                Hydration
              </p>
              <p className="price">$76.00</p>
            </div>
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default NewIn;
