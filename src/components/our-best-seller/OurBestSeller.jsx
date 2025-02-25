import React, { useEffect } from "react";
import Carousel from "react-multi-carousel";
import Slider from "react-slick";

import { useStore } from "../../store";

import "./OurBestSeller.scss";

const OurBestSeller = () => {
  const fetchBestSellersProducts = useStore(
    (state) => state.fetchBestSellersProducts
  );
  const bestSellersProducts = useStore(
    (state) => state.products.bestSellersProducts
  );
  const addItem = useStore((store) => store.addItem);

  useEffect(() => {
    fetchBestSellersProducts();
  }, []);

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
          {bestSellersProducts &&
            bestSellersProducts.map((product) => (
              <div className="product-item" key={product.productId} onClick={() => {
                addItem(product);
                alert('Add to cart successfully')
              }}>
                <img src={product.productImage} alt="category-item" />
                <div className="product-info">
                  <p className="name">{product.productName}</p>
                  <p className="desc">{product.summary}</p>
                  <p className="price">${product.price}</p>
                </div>
              </div>
            ))}
        </Carousel>
      </div>
    </div>
  );
};

export default OurBestSeller;
