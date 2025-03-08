import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { useStore } from "../../store";

import "./Cart.scss";
import CheckoutSuccess from "../checkout/CheckoutCOD";
import { createPayment } from "../../store/payment.api";
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
  const token = useStore((state) => state.profile.user?.token);
  const onUpdateQuantity = useStore((store) => store.updateQuantity);
  const onRemoveItem = useStore((store) => store.removeItem);

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
      console.log("Navigate to payment page:", values.products);
    },
  });

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

  return (
    <Box
      sx={{
        position: "relative",
        pt: 2,
        maxHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <Typography
        variant="body1"
        justifyContent={"space-between"}
        sx={{ px: 2, pb: 1, borderBottom: "1px solid #f0f0f0" }}
      >
        Total cart <b>({formik.values.products.length})</b>
      </Typography>

      <form onSubmit={formik.handleSubmit} style={{ width: 450 }}>
        <Box
          sx={{
            py: 2,
            overflowY: "auto",
            height: "calc(100vh - 390px)",
          }}
        >
          {formik.values.products.map((product, index) => (
            <Card
              key={index}
              sx={{
                display: "flex",
                mb: 2,
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                mx: 2,
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
                  <Typography variant="body1" fontWeight="bold" mb={2}>
                    {product.productName}
                  </Typography>
                ) : status === "fail" ? (
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="red"
                  ></Typography>
                ) : (
                  <Typography variant="h4" fontWeight="bold">
                    Payment completed.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box sx={{ m: 0, background: "#1a1a1a" }}>
          <img
            style={{ objectFit: "cover", height: 180 }}
            width={"100%"}
            src="cart-bg.avif"
            alt=""
          />

          <Typography
            variant="subtitle1"
            fontWeight="bold"
            display="flex"
            color="white"
            justifyContent="space-between"
            alignItems={"center"}
            m={0}
            mb={2}
            p={2}
          >
            Total:{" "}
            <span style={{ fontSize: "1.5rem", color: "#f44336" }}>
              {totalPrice.toLocaleString()}đ
            </span>
          </Typography>

          <Button
            variant="contained"
            color="error"
            type="submit"
            sx={{
              width: "93%",
              mx: 2,
              mb: 2,
              fontSize: "1.1rem",
            }}
          >
            Payment
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Cart;
