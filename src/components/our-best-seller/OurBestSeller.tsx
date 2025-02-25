import React from "react";
import Carousel from "react-multi-carousel";
import Slider from "react-slick";

import "./OurBestSeller.scss";

const OurBestSeller: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    // slidesToScroll: 4,
  };

  return (
    <div className="our-best-seller-container">
      <h2 className="title">Our Best Sellers</h2>

      <div className="our-best-seller-list">
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
            <img src="/products/product-1.png" alt="category-item" />
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
            <img src="/products/product-2.png" alt="category-item" />
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
            <img src="/products/product-3.png" alt="category-item" />
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
            <img src="/products/product-4.png" alt="category-item" />
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
        {/* <Slider {...settings}>
          <div className="product-item">
            <img src="/products/product-1.png" alt="category-item" />
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
            <img src="/products/product-2.png" alt="category-item" />
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
            <img src="/products/product-3.png" alt="category-item" />
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
            <img src="/products/product-4.png" alt="category-item" />
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
        </Slider> */}
      </div>
    </div>
  );
};

export default OurBestSeller;
