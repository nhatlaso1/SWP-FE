import React, { useEffect } from "react";
import Carousel from "react-multi-carousel";

import { useStore } from "../../store";
import { Product } from "../../store/product";

import "./NewIn.scss";

const NewIn: React.FC = () => {
  const fetchNewInProducts = useStore((state) => state.fetchNewInProducts);
  const newInProducts = useStore((state) => state.products.newInProducts);

  useEffect(() => {
    fetchNewInProducts();
  }, []);

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
          {newInProducts &&
            newInProducts.map((product: Product) => (
              <div className="product-item" key={product.$id}>
                <img src="/products/product-5.png" alt="category-item" />
                <div className="product-info">
                  <p className="name">{product.productName}</p>
                  <p className="desc">{product.summary}</p>
                  <p className="price">${product.price}</p>
                </div>
              </div>
            ))}
          {/* <div className="product-item">
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
          </div> */}
        </Carousel>
      </div>
    </div>
  );
};

export default NewIn;
