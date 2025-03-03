import { useEffect, useRef, useState } from "react";
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
  MenuItem,
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
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { useStore } from "../../store";

import "./Cart.scss";
import CheckoutSuccess from "../checkout/CheckoutSuccess";
import { createPayment } from "../../store/payment.api";
import CheckoutFail from "../checkout/CheckoutFail";
import { getAllVoucher } from "../../store/voucher.api";

const steps = [
  { label: "Shopping cart", icon: <ShoppingBagIcon /> },
  { label: "Order information", icon: <PeopleIcon /> },
  { label: "Payment", icon: <PaymentIcon /> },
  { label: "Result", icon: <PublishedWithChangesIcon /> },
];

const Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(0);
  const [voucher, setVoucher] = useState("0");
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("");
  const token = localStorage.getItem("token");
  const onUpdateQuantity = useStore((store) => store.updateQuantity);
  const onRemoveItem = useStore((store) => store.removeItem);
  const onCreateOrder = useStore((store) => store.createOrder);
  const orderIdRef = useRef(1);
  const [voucherList, setVoucherList] = useState([]);
  const [order, setOrder] = useState(null);

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
    const fetchVoucherList = async () => {
      try {
        const data = await getAllVoucher(token);
        setVoucherList(data);
      } catch (error) {
        console.error("Error fetching voucher list:", error);
      }
    };
    fetchVoucherList();
  }, [token]);
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const paymentStatus = searchParams.get("status");
    // Xử lý điều hướng theo kết quả thanh toán
    if (paymentStatus) {
      setStatus(paymentStatus); // Lưu trạng thái (success/fail)
      setActiveStep(3); // Chuyển qua bước 3 bất kể trạng thái
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
  const handlePayment = async () => {
    if (!orderIdRef.current) {
      console.error("Missing orderId. Cannot proceed with payment.");
      alert("Không tìm thấy mã đơn hàng.");
      return;
    }

    try {
      if (!token) {
        console.error("No token found. Please log in.");
        alert("Bạn cần đăng nhập để thanh toán.");
        return;
      }

      const paymentUrl = await createPayment(orderIdRef.current, token);
      console.log("Received payment URL:", paymentUrl);

      if (paymentUrl && paymentUrl.startsWith("http")) {
        window.location.href = paymentUrl; // Chuyển hướng trực tiếp
      } else {
        console.error("Invalid payment URL:", paymentUrl);
        alert("Không thể lấy liên kết thanh toán. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error(
        "Error calling payment API:",
        error.response || error.message
      );
      alert("Đã xảy ra lỗi khi kết nối với cổng thanh toán.");
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
    if (voucher !== "0") {
      const selectedVoucher = voucherList.find(
        (v) => v.voucherId.toString() === voucher
      );
      if (selectedVoucher) {
        discountValue = selectedVoucher.discountAmount;
      }
    }
    setDiscount(Math.min(discountValue, totalPrice));
  };
  useEffect(() => {
    if (activeStep === 3 && !order) {
      const timer = setTimeout(() => {
        // Giả lập order được trả về sau 3 giây
        setOrder({ orderId: orderIdRef.current, details: "Order details..." });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [activeStep, order]);

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
              <Typography
                sx={{
                  textAlign: "center",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#888",
                  mt: 4,
                }}
              >
                Your shopping cart is empty.
              </Typography>
            ) : (
              <form onSubmit={formik.handleSubmit}>
                {formik.values.products.map((product, index) => (
                  <Card
                    key={index}
                    sx={{
                      display: "flex",
                      mb: 2,
                      borderRadius: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{ width: 150, borderRadius: "12px 0 0 12px" }}
                      image={product.productImage}
                      alt={product.productName}
                    />
                    <CardContent
                      sx={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {product.productName}
                        </Typography>
                        <Typography
                          variant="h6"
                          color="error"
                          fontWeight="bold"
                        >
                          {product.price.toLocaleString()}đ
                        </Typography>
                      </Box>

                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <IconButton
                          onClick={() =>
                            updateQuantity(index, product.quantity - 1)
                          }
                        >
                          <RemoveIcon />
                        </IconButton>
                        <TextField
                          size="small"
                          sx={{ width: 70 }}
                          type="number"
                          name={`products[${index}].quantity`}
                          value={formik.values.products[index].quantity}
                          onChange={formik.handleChange}
                          inputProps={{ min: 1 }}
                        />
                        <IconButton
                          onClick={() =>
                            updateQuantity(index, product.quantity + 1)
                          }
                        >
                          <AddIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => removeProduct(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                ))}

                <Box
                  sx={{ display: "flex", gap: 2, alignItems: "center", mt: 3 }}
                >
                  <TextField
                    select
                    fullWidth
                    label="Your voucher"
                    variant="outlined"
                    value={voucher}
                    onChange={(e) => setVoucher(e.target.value)}
                    sx={{ flex: 1 }}
                  >
                    <MenuItem key="0" value="0">
                      No voucher
                    </MenuItem>
                    {voucherList.map((v) => (
                      <MenuItem
                        key={v.voucherId}
                        value={v.voucherId.toString()}
                      >
                        {v.voucherName} - {v.discountAmount.toLocaleString()}đ
                        off
                      </MenuItem>
                    ))}
                  </TextField>
                  <Button
                    variant="contained"
                    startIcon={<LocalOfferIcon />}
                    onClick={(e) => {
                      applyVoucher();
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    sx={{
                      backgroundColor: "#ff69b4",
                      "&:hover": { backgroundColor: "#d14795" },
                      padding: "12px 20px",
                    }}
                  >
                    Apply
                  </Button>
                </Box>

                <Box sx={{ mt: 4, borderTop: "2px solid #ddd", pt: 2 }}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    display="flex"
                    justifyContent="space-between"
                  >
                    Shipping fee: <span style={{ color: "#4caf50" }}>Free</span>
                  </Typography>

                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    display="flex"
                    justifyContent="space-between"
                  >
                    Total:{" "}
                    <span style={{ color: "#f44336" }}>
                      {total.toLocaleString()}đ
                    </span>
                  </Typography>

                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    display="flex"
                    justifyContent="space-between"
                  >
                    Discount:{" "}
                    <span style={{ color: "#4caf50" }}>
                      -{discount.toLocaleString()}đ
                    </span>
                  </Typography>

                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    display="flex"
                    justifyContent="space-between"
                    mt={2}
                  >
                    Final amount:{" "}
                    <span style={{ color: "#f44336" }}>
                      {(total - discount).toLocaleString()}đ
                    </span>
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  color="error"
                  fullWidth
                  type="submit"
                  sx={{ mt: 3, py: 1.5, fontSize: "1.1rem" }}
                >
                  CHECKOUT
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

                  const response = await onCreateOrder(
                    bodyCreateOrder,
                    voucher,
                    token
                  );
                  console.log("Create order response:", response);

                  if (response && response.orderId) {
                    orderIdRef.current = response.orderId;
                    setActiveStep(2); // Chuyển sang bước chọn phương thức thanh toán
                  } else {
                    console.error("Failed to get orderId:", response);

                    // Kiểm tra nếu lỗi là 401 (Unauthorized) => chuyển hướng đến trang đăng nhập
                    if (response?.status === 401) {
                      navigate("/login");
                    }
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
                gap: 3,
                mx: "auto",
                maxWidth: 500,
                padding: 4,
                borderRadius: "20px",
                backgroundColor: "#f3f4f6",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography variant="h4" fontWeight="bold" color="primary" mb={2}>
                Choose a Payment Method
              </Typography>

              <Button
                variant="contained"
                startIcon={<CreditCardIcon />}
                onClick={handlePayment}
                sx={{
                  width: "100%",
                  fontSize: "1.1rem",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  backgroundColor: "#4caf50",
                  ":hover": { backgroundColor: "#388e3c" },
                }}
              >
                Pay with Domestic Card
              </Button>

              <Button
                variant="contained"
                startIcon={<AccountBalanceIcon />}
                onClick={handlePayment}
                sx={{
                  width: "100%",
                  fontSize: "1.1rem",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  backgroundColor: "#2196f3",
                  ":hover": { backgroundColor: "#1976d2" },
                }}
              >
                Bank Transfer
              </Button>

              <Button
                variant="contained"
                startIcon={<PaymentIcon />}
                onClick={handlePayment}
                sx={{
                  width: "100%",
                  fontSize: "1.1rem",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  backgroundColor: "#f57c00",
                  ":hover": { backgroundColor: "#e65100" },
                }}
              >
                Pay with International Card
              </Button>
            </Box>
          )}

          {activeStep === 3 &&
            (!order ? (
              <div className="loading-container">
                <p className="loading-text">
                  Verify payment information...{" "}
                  <img
                    src="/loading-quiz-result.svg"
                    alt="Loading"
                    className="loading-img"
                  />
                </p>
              </div>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  mx: "auto",
                }}
              >
                {status === "success" ? (
                  <Typography variant="h4" fontWeight="bold" color="green">
                    <CheckoutSuccess />
                  </Typography>
                ) : status === "fail" ? (
                  <Typography variant="h4" fontWeight="bold" color="red">
                    <CheckoutFail />
                  </Typography>
                ) : (
                  <Typography variant="h4" fontWeight="bold">
                    Payment completed.
                  </Typography>
                )}
              </Box>
            ))}
        </Box>
      </div>
    </>
  );
};

export default Cart;
