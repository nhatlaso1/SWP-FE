import React, { useState } from "react";
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
} from "@mui/material";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

import "./SkinTestQuiz.scss";

const quizQuestions = [
  {
    question: "How does your skin feel after washing your face?",
    options: {
      a: "Tight & dry",
      b: "Balanced",
      c: "Oily",
      d: "Sensitive & red",
    },
    correctAnswer: "b",
  },
  {
    question: "How often do you experience breakouts?",
    options: {
      a: "Rarely",
      b: "Occasionally",
      c: "Frequently",
      d: "Almost never",
    },
    correctAnswer: "c",
  },
  {
    question: "What happens when you apply moisturizer?",
    options: {
      a: "Feels greasy",
      b: "Feels hydrated",
      c: "No effect",
      d: "Irritates my skin",
    },
    correctAnswer: "b",
  },
  {
    question: "How would you describe your pores?",
    options: {
      a: "Small & invisible",
      b: "Medium & normal",
      c: "Large & visible",
      d: "Red & inflamed",
    },
    correctAnswer: "b",
  },
  {
    question: "Does your skin get shiny throughout the day?",
    options: {
      a: "Never",
      b: "Slightly",
      c: "Yes, very shiny",
      d: "Only on my T-zone",
    },
    correctAnswer: "c",
  },
  {
    question: "How does your skin react to new skincare products?",
    options: {
      a: "Gets irritated",
      b: "Feels fine",
      c: "Becomes more oily",
      d: "Feels dry",
    },
    correctAnswer: "b",
  },
  {
    question: "Do you have visible redness on your face?",
    options: { a: "Yes, a lot", b: "Sometimes", c: "Rarely", d: "Never" },
    correctAnswer: "b",
  },
  {
    question: "What best describes your skin texture?",
    options: {
      a: "Smooth",
      b: "Slightly rough",
      c: "Very uneven",
      d: "Dry patches",
    },
    correctAnswer: "a",
  },
  {
    question: "How does your skin feel in cold weather?",
    options: { a: "Very dry", b: "Normal", c: "Oily", d: "Sensitive" },
    correctAnswer: "b",
  },
  {
    question: "How does your skin feel at the end of the day?",
    options: {
      a: "Dry & flaky",
      b: "Normal",
      c: "Very oily",
      d: "Tight & irritated",
    },
    correctAnswer: "b",
  },
];

const validationSchema = Yup.object().shape(
  quizQuestions.reduce((schema, _, index) => {
    schema[`q${index}`] = Yup.string().required("This question is required");
    return schema;
  }, {})
);

const SkinTestQuiz = () => {
  const [score, setScore] = useState(null);
  const [step, setStep] = useState(1);

  const formik = useFormik({
    initialValues: quizQuestions.reduce((values, _, index) => {
      values[`q${index}`] = "";
      return values;
    }, {}),
    validationSchema,
    onSubmit: (values) => {
      let correctAnswers = 0;
      setStep(2);
      setTimeout(() => {
        setStep(3);
      }, 5000);
      quizQuestions.forEach((q, index) => {
        if (values[`q${index}`] === q.correctAnswer) {
          correctAnswers++;
        }
      });
      setScore(correctAnswers);
    },
  });

  const answeredQuestions = Object.values(formik.values).filter(
    (val) => val !== ""
  ).length;
  const progress = (answeredQuestions / quizQuestions.length) * 100;

  return (
    <>
      <Header />

      <div className="quiz-page">
        {step === 1 && (
          <div className="quiz-test-container">
            <Box maxWidth="600px" mx="auto" mt={4} p={2}>
              <Typography variant="h4" align="center" gutterBottom>
                Skin Type Quiz
              </Typography>

              {/* Progress Bar */}
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
                          {Object.entries(q.options).map(([key, value]) => (
                            <FormControlLabel
                              key={key}
                              value={key}
                              control={<Radio />}
                              label={`${key}: ${value}`}
                            />
                          ))}
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

              {score !== null && (
                <Box mt={3} textAlign="center">
                  <Typography variant="h5">
                    You got {score} / {quizQuestions.length} correct!
                  </Typography>
                </Box>
              )}
            </Box>
          </div>
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

                <h3>DSPT</h3>
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
                    <Button
                      fullWidth
                      variant="contained"
                      style={{
                        color: "#fff",
                        width: "fit-content",
                      }}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>

              <div className="guide-to-use-wrap">
                <div className="divider">
                  Morning routine <img src="/am_sticker.png" alt="" />
                </div>
                <div className="section-use">
                  <div className="product-item">
                    <img src="/products/product-1.png" alt="" />
                    <p className="product-name">Alastin Gentle Cleanser</p>
                    <p className="product-price">$52.00</p>
                    <Button
                      fullWidth
                      variant="contained"
                      style={{
                        color: "#fff",
                        width: "fit-content",
                      }}
                    >
                      Add to Cart
                    </Button>
                  </div>

                  <div>
                    <div className="how-to-use">
                      <p className="title">Step 1 - Soothing Cleanser</p>
                      <p className="sub-title">
                        These face washes are ideal for sensitive skin, as they
                        use anti-inflammatory ingredients to soothe and calm
                        red, irritated skin. Smoothing cleansers contain only
                        gentle ingredients that are safe to use with rosacea,
                        eczema, hypersensitive, sensitive and post-procedure
                        skin. These cleansers are the best choice for those
                        struggling with red, flushed skin or when other
                        cleansers cause burning or stinging
                      </p>
                    </div>

                    <div className="other-products">
                      <p className="title">
                        Replace with one of the Approved options below
                      </p>
                      <div className="other-products-list">
                        <div className="other-product-item">
                          <img
                            src="/products/product-5.png"
                            alt="category-item"
                          />
                          <div className="product-info">
                            <p className="name">Derma Made Medi Wash</p>
                            <p className="price">$76.00</p>
                          </div>
                        </div>
                        <div className="other-product-item">
                          <img
                            src="/products/product-6.png"
                            alt="category-item"
                          />
                          <div className="product-info">
                            <p className="name">Derma Made Medi Wash</p>
                            <p className="price">$76.00</p>
                          </div>
                        </div>
                        <div className="other-product-item">
                          <img
                            src="/products/product-7.png"
                            alt="category-item"
                          />
                          <div className="product-info">
                            <p className="name">Derma Made Medi Wash</p>
                            <p className="price">$76.00</p>
                          </div>
                        </div>
                        <div className="other-product-item">
                          <img
                            src="/products/product-8.png"
                            alt="category-item"
                          />
                          <div className="product-info">
                            <p className="name">Derma Made Medi Wash</p>
                            <p className="price">$76.00</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="section-use">
                  <div className="product-item">
                    <img src="/products/product-2.png" alt="" />
                    <p className="product-name">
                      Jan Marini Luminate Face Lotion MD
                    </p>
                    <p className="product-price">$118.00</p>
                    <Button
                      fullWidth
                      variant="contained"
                      style={{
                        color: "#fff",
                        width: "fit-content",
                      }}
                    >
                      Add to Cart
                    </Button>
                  </div>

                  <div>
                    <div className="how-to-use">
                      <p className="title">Step 2 - Soothing Cleanser</p>
                      <p className="sub-title">
                        These skin-lightening products contain ingredients such
                        as vitamin C, niacinamide, kojic acid, and others that
                        brighten dark spots, creating a more even skin tone.
                        These products may contain hydrating ingredients as
                        well.
                      </p>
                    </div>

                    <div className="other-products">
                      <p className="title">
                        Replace with one of the Approved options below
                      </p>
                      <div className="other-products-list">
                        <div className="other-product-item">
                          <img
                            src="/products/product-5.png"
                            alt="category-item"
                          />
                          <div className="product-info">
                            <p className="name">Derma Made Medi Wash</p>
                            <p className="price">$76.00</p>
                          </div>
                        </div>
                        <div className="other-product-item">
                          <img
                            src="/products/product-6.png"
                            alt="category-item"
                          />
                          <div className="product-info">
                            <p className="name">Derma Made Medi Wash</p>
                            <p className="price">$76.00</p>
                          </div>
                        </div>
                        <div className="other-product-item">
                          <img
                            src="/products/product-7.png"
                            alt="category-item"
                          />
                          <div className="product-info">
                            <p className="name">Derma Made Medi Wash</p>
                            <p className="price">$76.00</p>
                          </div>
                        </div>
                        <div className="other-product-item">
                          <img
                            src="/products/product-8.png"
                            alt="category-item"
                          />
                          <div className="product-info">
                            <p className="name">Derma Made Medi Wash</p>
                            <p className="price">$76.00</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="divider">
                  Evening routine <img src="/pm_sticker.avif" alt="" />
                </div>
                <div className="section-use">
                  <div className="product-item">
                    <img src="/products/product-1.png" alt="" />
                    <p className="product-name">Alastin Gentle Cleanser</p>
                    <p className="product-price">$52.00</p>
                    <Button
                      fullWidth
                      variant="contained"
                      style={{
                        color: "#fff",
                        width: "fit-content",
                      }}
                    >
                      Add to Cart
                    </Button>
                  </div>

                  <div>
                    <div className="how-to-use">
                      <p className="title">Step 1 - Soothing Cleanser</p>
                      <p className="sub-title">
                        These face washes are ideal for sensitive skin, as they
                        use anti-inflammatory ingredients to soothe and calm
                        red, irritated skin. Smoothing cleansers contain only
                        gentle ingredients that are safe to use with rosacea,
                        eczema, hypersensitive, sensitive and post-procedure
                        skin. These cleansers are the best choice for those
                        struggling with red, flushed skin or when other
                        cleansers cause burning or stinging
                      </p>
                    </div>

                    <div className="other-products">
                      <p className="title">
                        Replace with one of the Approved options below
                      </p>
                      <div className="other-products-list">
                        <div className="other-product-item">
                          <img
                            src="/products/product-5.png"
                            alt="category-item"
                          />
                          <div className="product-info">
                            <p className="name">Derma Made Medi Wash</p>
                            <p className="price">$76.00</p>
                          </div>
                        </div>
                        <div className="other-product-item">
                          <img
                            src="/products/product-6.png"
                            alt="category-item"
                          />
                          <div className="product-info">
                            <p className="name">Derma Made Medi Wash</p>
                            <p className="price">$76.00</p>
                          </div>
                        </div>
                        <div className="other-product-item">
                          <img
                            src="/products/product-7.png"
                            alt="category-item"
                          />
                          <div className="product-info">
                            <p className="name">Derma Made Medi Wash</p>
                            <p className="price">$76.00</p>
                          </div>
                        </div>
                        <div className="other-product-item">
                          <img
                            src="/products/product-8.png"
                            alt="category-item"
                          />
                          <div className="product-info">
                            <p className="name">Derma Made Medi Wash</p>
                            <p className="price">$76.00</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="section-use">
                  <div className="product-item">
                    <img src="/products/product-2.png" alt="" />
                    <p className="product-name">Alastin Gentle Cleanser</p>
                    <p className="product-price">$52.00</p>
                    <Button
                      fullWidth
                      variant="contained"
                      style={{
                        color: "#fff",
                        width: "fit-content",
                      }}
                    >
                      Add to Cart
                    </Button>
                  </div>

                  <div>
                    <div className="how-to-use">
                      <p className="title">
                        Step 2 - Skin Lightening for Dry Skin
                      </p>
                      <p className="sub-title">
                        These skin-lightening products contain ingredients such
                        as vitamin C, niacinamide, kojic acid, and others that
                        brighten dark spots, creating a more even skin tone.
                        These products may contain hydrating ingredients as
                        well.
                      </p>
                    </div>

                    <div className="other-products">
                      <p className="title">
                        Replace with one of the Approved options below
                      </p>
                      <div className="other-products-list">
                        <div className="other-product-item">
                          <img
                            src="/products/product-5.png"
                            alt="category-item"
                          />
                          <div className="product-info">
                            <p className="name">Derma Made Medi Wash</p>
                            <p className="price">$76.00</p>
                          </div>
                        </div>
                        <div className="other-product-item">
                          <img
                            src="/products/product-6.png"
                            alt="category-item"
                          />
                          <div className="product-info">
                            <p className="name">Derma Made Medi Wash</p>
                            <p className="price">$76.00</p>
                          </div>
                        </div>
                        <div className="other-product-item">
                          <img
                            src="/products/product-7.png"
                            alt="category-item"
                          />
                          <div className="product-info">
                            <p className="name">Derma Made Medi Wash</p>
                            <p className="price">$76.00</p>
                          </div>
                        </div>
                        <div className="other-product-item">
                          <img
                            src="/products/product-8.png"
                            alt="category-item"
                          />
                          <div className="product-info">
                            <p className="name">Derma Made Medi Wash</p>
                            <p className="price">$76.00</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="section-use">
                  <div className="product-item">
                    <img src="/products/product-3.png" alt="" />
                    <p className="product-name">Alastin Gentle Cleanser</p>
                    <p className="product-price">$52.00</p>
                    <Button
                      fullWidth
                      variant="contained"
                      style={{
                        color: "#fff",
                        width: "fit-content",
                      }}
                    >
                      Add to Cart
                    </Button>
                  </div>

                  <div>
                    <div className="how-to-use">
                      <p className="title">
                        Step 3 - Lightening Barrier Repair Moisturizer
                      </p>
                      <p className="sub-title">
                        Skin barrier repair moisturizers have ceramides, fatty
                        acids, and cholesterol to mimic the skin’s natural
                        barrier. This moisturizer has been formulated with
                        unsaturated fatty acids. This type of fatty acid helps
                        skin lighteners work better by blocking an enzyme called
                        tyrosinase. Choose this moisturizer if you have dry skin
                        and you want to erase dark spots, even skin tone or
                        brighten your skin.
                      </p>
                    </div>

                    <div className="other-products">
                      <p className="title">
                        Replace with one of the Approved options below
                      </p>
                      <div className="other-products-list">
                        <div className="other-product-item">
                          <img
                            src="/products/product-5.png"
                            alt="category-item"
                          />
                          <div className="product-info">
                            <p className="name">Derma Made Medi Wash</p>
                            <p className="price">$76.00</p>
                          </div>
                        </div>
                        <div className="other-product-item">
                          <img
                            src="/products/product-6.png"
                            alt="category-item"
                          />
                          <div className="product-info">
                            <p className="name">Derma Made Medi Wash</p>
                            <p className="price">$76.00</p>
                          </div>
                        </div>
                        <div className="other-product-item">
                          <img
                            src="/products/product-7.png"
                            alt="category-item"
                          />
                          <div className="product-info">
                            <p className="name">Derma Made Medi Wash</p>
                            <p className="price">$76.00</p>
                          </div>
                        </div>
                        <div className="other-product-item">
                          <img
                            src="/products/product-8.png"
                            alt="category-item"
                          />
                          <div className="product-info">
                            <p className="name">Derma Made Medi Wash</p>
                            <p className="price">$76.00</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
