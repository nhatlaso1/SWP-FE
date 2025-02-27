import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Field, Form, Formik, useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PeopleIcon from "@mui/icons-material/People";
import PaymentIcon from "@mui/icons-material/Payment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";

import { useStore } from "../../store";

import "./Cart.scss";
import CheckoutSuccess from "../checkout/CheckoutSuccess";
import { createPayment } from "../../store/payment.api";

const steps = [
  { label: "Shopping cart", icon: <ShoppingBagIcon /> },
  { label: "Order information", icon: <PeopleIcon /> },
  { label: "Payment", icon: <PaymentIcon /> },
  { label: "Completed", icon: <CheckCircleIcon /> },
];

const Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(0);
  const [voucher, setVoucher] = useState("");
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);

  const onUpdateQuantity = useStore((store) => store.updateQuantity);
  const onRemoveItem = useStore((store) => store.removeItem);
  const onCreateOrder = useStore((store) => store.createOrder);

  const cart = useStore((store) => store.cart.cart);
  const formik = useFormik({
    initialValues: {
      products: cart,
    },
    validationSchema: Yup.object({
      products: Yup.array().of(
        Yup.object().shape({
          quantity: Yup.number()
            .min(1, "Quantity must be at least 1")
            .required("Quantity is required"),
        })
      ),
    }),
    onSubmit: (values) => {
      console.log("Placing order with:", values.products);
      setActiveStep(activeStep + 1);
    },
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    // Xử lý điều hướng theo kết quả thanh toán
    if (location.pathname === "/success") {
      setActiveStep(3); // Thành công
    } else if (location.pathname === "/fail") {
      navigate("/fail"); // Thất bại
    }

    // Cập nhật giỏ hàng vào form
    formik.setFieldValue("products", cart);
  }, [location.pathname, location.search, navigate, cart]);

  const validationSchema = Yup.object({
    fullName: Yup.string().required("Full name is required"),
    address: Yup.string().required("Address is required"),
    phoneNumber: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
  });
  const [orderIds, setOrderIds] = useState([]);

  const handlePayment = async (orderId) => {
    try {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }

      const paymentUrl = await createPayment(orderId, token); // Truyền token vào API
      if (paymentUrl) {
        window.location.href = paymentUrl; // Chuyển hướng đến trang thanh toán
      } else {
        console.error("Failed to get payment URL.");
      }
    } catch (error) {
      console.error("Error calling payment API:", error);
    }
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    formik.setFieldValue(`products[${index}].quantity`, newQuantity);
    onUpdateQuantity(cart[index].productId, newQuantity);
  };

  const removeProduct = (index) => {
    const newProducts = formik.values.products.filter((_, i) => i !== index);
    formik.setFieldValue("products", newProducts);
    onRemoveItem(cart[index].productId);
  };

  const totalPrice = formik.values.products.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );

  const applyVoucher = () => {
    let discountValue = 0;

    switch (voucher) {
      case "SALE50":
        discountValue = 50000;
        break;
      case "SALE100":
        discountValue = 100000;
        break;
      case "SALE150":
        discountValue = 150000;
        break;
      case "SALE200":
        discountValue = 200000;
        break;
      case "PERCENT5":
        discountValue = totalPrice * 0.05;
        break;
      case "PERCENT10":
        discountValue = totalPrice * 0.1;
        break;
      case "PERCENT15":
        discountValue = totalPrice * 0.15;
        break;
      case "PERCENT20":
        discountValue = totalPrice * 0.2;
        break;
      case "PERCENT25":
        discountValue = totalPrice * 0.25;
        break;
      case "PERCENT30":
        discountValue = totalPrice * 0.3;
        break;
      default:
        discountValue = 0;
        break;
    }

    setDiscount(Math.min(discountValue, totalPrice));
  };

  useEffect(() => {
    setTotal(totalPrice - discount);
  }, [discount, totalPrice]);

  return (
    <>
      <div className="cart-page">
        <Box
          sx={{
            maxWidth: 800,
            margin: "auto",
            padding: 2,
            background: "#fff",
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              sx={{ px: 0 }}
              variant="text"
              onClick={() => {
                activeStep === 0
                  ? navigate("/")
                  : setActiveStep(activeStep - 1);
              }}
            >
              <ArrowBackIosNewOutlinedIcon sx={{ fontSize: 16, mr: 1 }} />{" "}
              {activeStep === 0 ? "Buy more products" : "Back"}
            </Button>

            <Typography variant="h5" gutterBottom>
              Shopping cart 🛒
            </Typography>
          </Box>

          <Box
            sx={{
              width: "100%",
              py: 2,
              backgroundColor: "#fdecec",
              borderRadius: 2,
              my: 2,
            }}
          >
            <Stepper activeStep={activeStep} alternativeLabel connector={<></>}>
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepLabel
                    icon={
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor:
                            index === activeStep ? "#d32f2f" : "#fff",
                          border:
                            index === activeStep
                              ? "2px solid #d32f2f"
                              : "2px solid #888",
                          color: index === activeStep ? "#fff" : "#888",
                        }}
                      >
                        {step.icon}
                      </Box>
                    }
                  >
                    <Typography
                      sx={{
                        color: index === activeStep ? "#d32f2f" : "#666",
                        fontWeight: index === activeStep ? "bold" : "normal",
                        mt: 1,
                      }}
                    >
                      {step.label}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {activeStep === 0 &&
            (formik.values.products.length === 0 ? (
              <Typography sx={{ textAlign: "center" }}>
                Your shopping cart is empty.
              </Typography>
            ) : (
              <form onSubmit={formik.handleSubmit}>
                {formik.values.products.map((product, index) => (
                  <Card
                    key={index}
                    sx={{ display: "flex", mb: 2, boxShadow: "none" }}
                  >
                    <CardMedia
                      component="img"
                      style={{
                        width: 150,
                        objectFit: "cover",
                        aspectRatio: "1/1",
                      }}
                      image={product.productImage}
                      alt={product.productName}
                    />
                    <CardContent
                      sx={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 2,
                      }}
                    >
                      <Typography fontWeight={"bold"} variant="subtitle1">
                        {product.productName}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          minWidth: 186,
                          gap: 2,
                        }}
                      >
                        <Typography
                          fontWeight={"bold"}
                          color="error"
                          variant="h6"
                        >
                          {product.price.toLocaleString()}đ
                        </Typography>
                        <Grid
                          container
                          spacing={1}
                          alignItems="center"
                          sx={{ mt: 1 }}
                        >
                          <Grid item>
                            <IconButton
                              size="small"
                              onClick={() =>
                                updateQuantity(index, product.quantity - 1)
                              }
                            >
                              <RemoveIcon />
                            </IconButton>
                          </Grid>
                          <Grid item>
                            <TextField
                              size="small"
                              sx={{ width: 50 }}
                              type="number"
                              slotProps={{ min: 1 }}
                              name={`products[${index}].quantity`}
                              value={formik.values.products[index].quantity}
                              onChange={formik.handleChange}
                              error={
                                formik.touched.products &&
                                formik.errors.products &&
                                Boolean(formik.errors.products[index]?.quantity)
                              }
                              helperText={
                                formik.errors.products &&
                                formik.errors.products[index]?.quantity
                              }
                            />
                          </Grid>
                          <Grid item>
                            <IconButton
                              size="small"
                              onClick={() =>
                                updateQuantity(index, product.quantity + 1)
                              }
                            >
                              <AddIcon />
                            </IconButton>
                          </Grid>
                          <Grid item>
                            <IconButton
                              color="error"
                              onClick={() => removeProduct(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Box>
                    </CardContent>
                  </Card>
                ))}

                <Box
                  sx={{ width: 500, maxWidth: "100%", display: "flex", gap: 1 }}
                >
                  <TextField
                    fullWidth
                    label="Nhập mã giảm giá"
                    variant="outlined"
                    value={voucher}
                    onChange={(e) => setVoucher(e.target.value)}
                  />
                  <button
                    onClick={(e) => {
                      applyVoucher();
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#ff69b4",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Áp dụng
                  </button>
                </Box>

                <Box sx={{ textAlign: "right", my: 4 }}>
                  <Typography
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                    fontWeight={"bold"}
                  >
                    Shipping fee: <b>Free</b>
                  </Typography>
                  <Typography
                    style={{ display: "flex", justifyContent: "space-between" }}
                    variant="h6"
                    fontWeight={"bold"}
                  >
                    Total:
                    <Typography
                      fontWeight={"bold"}
                      variant="h6"
                      component="span"
                      color="error"
                    >
                      {total.toLocaleString()}đ
                    </Typography>
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  color="error"
                  fullWidth
                  type="submit"
                  sx={{ py: 1.5 }}
                >
                  ORDER NOW
                </Button>
              </form>
            ))}

          {activeStep === 1 && (
            <Formik
              initialValues={{
                fullName: "",
                address: "",
                phoneNumber: "",
              }}
              validationSchema={validationSchema}
              onSubmit={async (values) => {
                try {
                  const bodyCreateOrder = {
                    address: values.address,
                    phoneNumber: values.phoneNumber,
                    orderDetailRequests: cart.map((item) => ({
                      productId: item.productId,
                      quantity: item.quantity,
                    })),
                  };

                  const response = await onCreateOrder(bodyCreateOrder);
                  console.log("Create order response:", response);

                  if (response && response.orderId) {
                    setOrderIds((prevOrderIds) => [
                      ...prevOrderIds,
                      response.orderId,
                    ]);
                    await handlePayment(response.orderId);
                  } else {
                    console.error("Failed to get orderId:", response);
                  }
                } catch (error) {
                  console.error("Error creating order:", error);
                }
              }}
            >
              {({ errors, touched }) => (
                <Form>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      mx: "auto",
                    }}
                  >
                    <Field
                      as={TextField}
                      name="fullName"
                      label="Full Name"
                      variant="outlined"
                      fullWidth
                      error={touched.fullName && Boolean(errors.fullName)}
                      helperText={touched.fullName && errors.fullName}
                    />
                    <Field
                      as={TextField}
                      name="address"
                      label="Address"
                      variant="outlined"
                      fullWidth
                      error={touched.address && Boolean(errors.address)}
                      helperText={touched.address && errors.address}
                    />
                    <Field
                      as={TextField}
                      name="phoneNumber"
                      label="Phone Number"
                      variant="outlined"
                      fullWidth
                      error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                      helperText={touched.phoneNumber && errors.phoneNumber}
                    />
                    <Button
                      variant="contained"
                      color="error"
                      fullWidth
                      type="submit"
                      sx={{ py: 1.5 }}
                    >
                      ORDER NOW
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          )}
          {activeStep === 2 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                mx: "auto",
              }}
            >
              <Typography variant="h4" fontWeight={"bold"}>
                Payment container
              </Typography>
              <CheckoutSuccess />
            </Box>
          )}
          {activeStep === 3 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                mx: "auto",
              }}
            >
              <Typography variant="h4" fontWeight={"bold"}>
                Payment success
              </Typography>
            </Box>
          )}
        </Box>
      </div>
    </>
  );
};

export default Cart;
