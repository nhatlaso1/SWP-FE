import React from "react";
import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";

interface CartItemProps {
  product: {
    productId: number;
    productName: string;
    productImage: string;
    category: string;
    skintype: any;
    price: number;
    quantity: number;
    note?: string;
  };
}

const CartItem: React.FC<CartItemProps> = ({ product }) => {
  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        mb: 2,
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        padding: "8px",
      }}
    >
      <CardMedia
        component="img"
        sx={{
          width: 60,
          height: 60,
          borderRadius: "6px",
          objectFit: "cover",
          marginRight: "8px",
        }}
        image={product.productImage}
        alt={product.productName}
      />
      <CardContent sx={{ flexGrow: 1, padding: 0 }}>
        <Typography variant="body1" fontWeight="bold" color="#333">
          {product.productName}
        </Typography>

        {/* Hiển thị category và dung tích */}
        <Typography variant="caption" color="text.secondary">
          {`Phân loại: ${product.category}`}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          {`Loại da: ${Array.isArray(product.skintype?.$values)
            ? product.skintype.$values.map((s: any) => s.skinTypeName).join(", ")
            : product.skintype?.skinTypeName || ""
            }`}
        </Typography>

        {/* Hiển thị note (nếu có) */}
        {product.note && (
          <Typography variant="caption" color="text.secondary">
            {product.note}
          </Typography>
        )}

        {/* Giá */}
        <Typography
          variant="body2"
          fontWeight="bold"
          sx={{ color: product.price === 0 ? "#888" : "error.main", mt: 0.5 }}
        >
          {product.price === 0
            ? "0 đ"
            : `${product.price.toLocaleString("vi-VN")} đ`}
        </Typography>
      </CardContent>

      {/* Số lượng (read-only) */}
      <CardContent sx={{ padding: 0, display: "flex", alignItems: "center" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            backgroundColor: "#fff6f6",
            borderRadius: "6px",
            padding: "4px 8px",
          }}
        >
          <Typography variant="body2">Quantity:</Typography>
          <Typography variant="body2" fontWeight="bold">
            {product.quantity}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CartItem;
