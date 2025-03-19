import { useEffect, useRef, useState } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useStore } from "../../store";
import "./SkinTestResult.scss";

const SkinTestResult = () => {
  const navigate = useNavigate();
  const skinRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const addItem = useStore((state) => state.addItem);
  const fetchRoutine = useStore((state) => state.fetchRoutine);
  const skinType = useStore((state) => state.routine.skinType);
  const routineDetail = useStore((state) => state.routine.routineDetail);
  const userProfile = useStore((state) => state.profile.userProfile);

  const scrollToTop = () => {
    if (skinRef.current) {
      skinRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const loadRoutine = async () => {
      setLoading(true);
      const skinTypeId = userProfile?.skinType?.skinTypeId;
      console.log("userProfile", userProfile, skinTypeId);
      if (skinTypeId) {
        await fetchRoutine(skinTypeId);
      }
      setLoading(false);
    };
    if (!routineDetail) {
      loadRoutine();
    }
  }, []);

  return (
    <>
      <div className="skin-test-result-page" ref={skinRef}>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="80vh"
          >
            <CircularProgress />
          </Box>
        ) : (
          <div className="quiz-result-container">
            <div className="quiz-result-header">
              <img src="/quiz-result-bg.jpg" alt="" />

              <div className="greeting-wrap">
                <h4>Your Recommended Skincare Routine</h4>
                <h3>{skinType && skinType.skinTypeName}</h3>
              </div>
            </div>

            <div className="quiz-result-content">
              <div className="guide-to-use-wrap">
                {routineDetail &&
                  routineDetail[0].routineDetailName === "Morning" && (
                    <>
                      <div className="divider">
                        Morning routine <img src="/am_sticker.png" alt="" />
                      </div>
                      {routineDetail[0].routineSteps.$values.length > 0 &&
                        routineDetail[0].routineSteps.$values.map(
                          (step, index) => (
                            <div className="section-use" key={index}>
                              {routineDetail[0].routineSteps.$values[0].category
                                .products.$values.length > 0 && (
                                <div className="product-item">
                                  <img
                                    src={
                                      routineDetail[0].routineSteps.$values[0]
                                        .category.products.$values[0]
                                        .productImages.$values[0].url
                                    }
                                    alt=""
                                  />
                                  <p className="product-name">
                                    {
                                      routineDetail[0].routineSteps.$values[0]
                                        .category.products.$values[0]
                                        .productName
                                    }
                                  </p>
                                  <p className="product-price">
                                    {
                                      routineDetail[0].routineSteps.$values[0]
                                        .category.products.$values[0].price.toLocaleString()
                                    }VND
                                  </p>
                                  <Button
                                    fullWidth
                                    variant="contained"
                                    style={{
                                      color: "#fff",
                                      width: "fit-content",
                                    }}
                                    onClick={() => {
                                      const product = {
                                        productId:
                                          routineDetail[0].routineSteps
                                            .$values[0].category.products
                                            .$values[0].productId,
                                        productName:
                                          routineDetail[0].routineSteps
                                            .$values[0].category.products
                                            .$values[0].productName,
                                        productImage:
                                          routineDetail[0].routineSteps
                                            .$values[0].category.products
                                            .$values[0].productImages.$values[0]
                                            .url,
                                        price:
                                          routineDetail[0].routineSteps
                                            .$values[0].category.products
                                            .$values[0].price,
                                        category:
                                          routineDetail[0].routineSteps.$values[0].category.categoryName
                                      };
                                      addItem({
                                        productId : product.productId,
                                        productName : product.productName,
                                        productImage : product.productImage,
                                        price : product.price,
                                        category: product.category,
                                        skinType: skinType.skinTypeName,
                                        quantity: 1
                                      });
                                    }}
                                  >
                                    Add to Cart
                                  </Button>
                                </div>
                              )}

                              <div>
                                <div className="how-to-use">
                                  <p className="title">
                                    {step.step} - {step.category.categoryName}
                                  </p>
                                  <p className="sub-title">
                                    {step.instruction}
                                  </p>
                                </div>
                                <div className="other-products">
                                  <p className="title">
                                    Replace with one of the Approved options
                                    below
                                  </p>
                                  <div className="other-products-list">
                                    {routineDetail[0].routineSteps.$values
                                      .length > 0 &&
                                      routineDetail[0].routineSteps.$values[0]
                                        .category.products.$values.length > 0 &&
                                      routineDetail[0].routineSteps.$values[0].category.products.$values
                                        .slice(1)
                                        .map((product) => (
                                          <div
                                            key={product.productId}
                                            className="other-product-item"
                                            onClick={() =>
                                              navigate(
                                                `/product/${product.productId}`
                                              )
                                            }
                                          >
                                            <img
                                              src={
                                                product.productImages.$values[0]
                                                  .url
                                              }
                                              alt="category-item"
                                            />
                                            <div className="product-info">
                                              <p className="name">
                                                {product.productName}
                                              </p>
                                              <p className="price">
                                                {product.price.toLocaleString()}VND
                                              </p>
                                            </div>
                                          </div>
                                        ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                    </>
                  )}

                {routineDetail &&
                  routineDetail[1].routineDetailName === "Evening" && (
                    <>
                      <div className="divider">
                        Evening routine <img src="/pm_sticker.avif" alt="" />
                      </div>
                      {routineDetail[1].routineSteps.$values.length > 0 &&
                        routineDetail[1].routineSteps.$values.map(
                          (step, index) => (
                            <div className="section-use" key={index}>
                              {routineDetail[0].routineSteps.$values[0].category
                                .products.$values.length > 0 && (
                                <div className="product-item">
                                  <img
                                    src={
                                      routineDetail[1].routineSteps.$values[0]
                                        .category.products.$values[0]
                                        .productImages.$values[0].url
                                    }
                                    alt=""
                                  />
                                  <p className="product-name">
                                    {
                                      routineDetail[1].routineSteps.$values[0]
                                        .category.products.$values[0]
                                        .productName
                                    }
                                  </p>
                                  <p className="product-price">
                                    $
                                    {
                                      routineDetail[1].routineSteps.$values[0]
                                        .category.products.$values[0].price
                                    }
                                  </p>
                                  <Button
                                    fullWidth
                                    variant="contained"
                                    style={{
                                      color: "#fff",
                                      width: "fit-content",
                                    }}
                                    onClick={() => {
                                      const product = {
                                        productId:
                                          routineDetail[1].routineSteps
                                            .$values[0].category.products
                                            .$values[0].productId,
                                        productName:
                                          routineDetail[1].routineSteps
                                            .$values[0].category.products
                                            .$values[0].productName,
                                        productImage:
                                          routineDetail[1].routineSteps
                                            .$values[0].category.products
                                            .$values[0].productImages.$values[0]
                                            .url,
                                        price:
                                          routineDetail[1].routineSteps
                                            .$values[0].category.products
                                            .$values[0].price,
                                      };
                                      addItem(product);
                                    }}
                                  >
                                    Add to Cart
                                  </Button>
                                </div>
                              )}

                              <div>
                                <div className="how-to-use">
                                  <p className="title">
                                    {step.step} - {step.category.categoryName}
                                  </p>
                                  <p className="sub-title">
                                    {step.instruction}
                                  </p>
                                </div>
                                <div className="other-products">
                                  <p className="title">
                                    Replace with one of the Approved options
                                    below
                                  </p>
                                  <div className="other-products-list">
                                    {routineDetail[1].routineSteps.$values
                                      .length > 0 &&
                                      routineDetail[1].routineSteps.$values[0]
                                        .category.products.$values.length > 0 &&
                                      routineDetail[1].routineSteps.$values[0].category.products.$values
                                        .slice(1)
                                        .map((product) => (
                                          <div
                                            key={product.productId}
                                            className="other-product-item"
                                            onClick={() =>
                                              navigate(
                                                `/product/${product.productId}`
                                              )
                                            }
                                          >
                                            <img
                                              src={
                                                product.productImages.$values[0]
                                                  .url
                                              }
                                              alt="category-item"
                                            />
                                            <div className="product-info">
                                              <p className="name">
                                                {product.productName}
                                              </p>
                                              <p className="price">
                                                ${product.price}
                                              </p>
                                            </div>
                                          </div>
                                        ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                    </>
                  )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SkinTestResult;
