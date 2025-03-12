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

const Cart = () => {
  const navigate = useNavigate();
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
            height: "calc(100vh - 348px)",
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
                  <Typography variant="body2" mb={2}>
                    {product.summary ? product.summary : ""}
                  </Typography>
                  <Box sx={{ my: 1 }}>
                    <IconButton
                      sx={{ px: 0 }}
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
                      sx={{ px: 0 }}
                      onClick={() =>
                        updateQuantity(index, product.quantity + 1)
                      }
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <IconButton
                    color="error"
                    onClick={() => removeProduct(index)}
                  >
                    <CloseIcon />
                  </IconButton>
                  <Typography variant="caption" fontWeight={"bold"}>
                    {product.price.toLocaleString()} đ
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box sx={{ m: 0, background: "#1a1a1a" }}>
          <img
            style={{ objectFit: "cover", height: 160 }}
            width={"100%"}
            src="cart-bg.avif.jpg"
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
            mb={1}
            py={1}
            px={2}
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
            onClick={() => navigate("/checkout")}
          >
            Payment
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Cart;
