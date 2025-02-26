import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormHelperText,
  LinearProgress,
  Radio,
  RadioGroup,
  Typography,
  CircularProgress,
} from "@mui/material";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { useStore } from "../../store";
import "./SkinTestQuiz.scss";

const SkinTestQuiz = () => {
  const skinRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const fetchQuestionsSkinTest = useStore(
    (state) => state.fetchQuestionsSkinTest
  );
  const addItem = useStore((state) => state.addItem);
  const determineSkinType = useStore((state) => state.determineSkinType);
  const quizQuestions = useStore((state) => state.routine.skinTypeQuestions);
  const skinType = useStore((state) => state.routine.skinType);
  const routineDetail = useStore((state) => state.routine.routineDetail);
  const [step, setStep] = useState(1);

  const scrollToTop = () => {
    if (skinRef.current) {
      skinRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      await fetchQuestionsSkinTest();
      setLoading(false);
    };
    loadQuestions();
  }, []);

  const validationSchema = Yup.object(
    (quizQuestions || []).reduce((schema, _, index) => {
      schema[`q${index}`] = Yup.string().required("This question is required");
      return schema;
    }, {})
  );

  const formik = useFormik({
    initialValues: (quizQuestions || []).reduce((values, _, index) => {
      values[`q${index}`] = "";
      return values;
    }, {}),
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      setStep(2);
      determineSkinType(Object.values(values).map((ans) => parseInt(ans)));
      scrollToTop();
      setTimeout(() => setStep(3), 5000);
    },
  });

  const answeredQuestions = Object.values(formik.values).filter(
    (val) => val !== ""
  ).length;
  const totalQuestions = quizQuestions ? quizQuestions.length : 0;
  const progress =
    totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

  return (
    <>
      <Header />

      <div className="quiz-page" ref={skinRef}>
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
          step === 1 && (
            <div className="quiz-test-container">
              <Box maxWidth="600px" mx="auto" mt={4} p={2}>
                <Typography variant="h4" align="center" gutterBottom>
                  Skin Type Quiz
                </Typography>

                <Box mt={2} mb={3}>
                  <Typography variant="body1" align="center">
                    Progress: {answeredQuestions} / {quizQuestions.length}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{ height: 8, borderRadius: 5 }}
                  />
                </Box>

                <form onSubmit={formik.handleSubmit}>
                  {quizQuestions.map((q, index) => (
                    <Card key={index} sx={{ mb: 2, boxShadow: 3 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {index + 1}. {q.question}
                        </Typography>
                        <FormControl
                          component="fieldset"
                          error={
                            formik.touched[`q${index}`] &&
                            Boolean(formik.errors[`q${index}`])
                          }
                        >
                          <RadioGroup
                            name={`q${index}`}
                            value={formik.values[`q${index}`]}
                            onChange={formik.handleChange}
                          >
                            {q.options.map((value) =>
                              Object.entries(value).map(([key, value]) => (
                                <FormControlLabel
                                  key={key}
                                  value={key}
                                  control={<Radio />}
                                  label={value}
                                />
                              ))
                            )}
                          </RadioGroup>
                          <FormHelperText>
                            {formik.touched[`q${index}`] &&
                              formik.errors[`q${index}`]}
                          </FormHelperText>
                        </FormControl>
                      </CardContent>
                    </Card>
                  ))}

                  <Box mt={2} display="flex" justifyContent="center">
                    <Button type="submit" variant="contained" color="primary">
                      Submit Quiz
                    </Button>
                  </Box>
                </form>
              </Box>
            </div>
          )
        )}

        {step === 2 && (
          <div className="loading-quiz-result">
            Preparing scientific recommendations...
            <img src="/loading-quiz-result.svg" alt="" />
          </div>
        )}

        {step === 3 && (
          <div className="quiz-result-container">
            <div className="quiz-result-header">
              <img src="/quiz-result-bg.jpg" alt="" />

              <div className="greeting-wrap">
                <h4>
                  Hello, <br /> Your Baumann Skin Type is
                </h4>
                <p>Dry, Sensitive, Pigmented, Tight</p>
                <p>
                  This dry skin type is characterized by recurrent skin
                  inflammation and an uneven skin tone. The DSPT skincare
                  regimen should treat the dryness and inflammation first, and
                  then proceed to treat the pigmentation. Laser and light
                  treatments may be used.
                </p>

                <h3>{skinType && skinType.skinTypeName}</h3>
              </div>
            </div>

            <div className="quiz-result-content">
              <div className="recommended-wrap">
                <p className="heading">Your Recommended Skincare Routine</p>
                <div className="recommended-list">
                  <img src="/recomended-bg.png" alt="" />

                  <div className="recommended-text">
                    <h4>Up to 25% off in Cart!</h4>
                    <ul>
                      <li>Free UPS Ground Shipping</li>
                      <li>Up to 25% Savings</li>
                      <li>Reward Points up to 5% cash back</li>
                    </ul>
                    <p>
                      Use code: <b>ROUTINE25</b> for up to 25% Off when you
                      purchase 3 or more products in your routine.*
                    </p>
                    {/* <Button
                      fullWidth
                      variant="contained"
                      style={{
                        color: "#fff",
                        width: "fit-content",
                      }}
                    >
                      Add to Cart
                    </Button> */}
                  </div>
                </div>
              </div>

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
                                    $
                                    {
                                      routineDetail[0].routineSteps.$values[0]
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
                                    {routineDetail[0].routineSteps.$values
                                      .length > 0 &&
                                      routineDetail[0].routineSteps.$values[0]
                                        .category.products.$values.length > 0 &&
                                      routineDetail[0].routineSteps.$values[0].category.products.$values
                                        .slice(1)
                                        .map((product) => (
                                          <div className="other-product-item">
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
                                          <div className="other-product-item">
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

      <Footer />
    </>
  );
};

export default SkinTestQuiz;
