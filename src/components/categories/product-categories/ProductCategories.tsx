import React, { useEffect, useState } from "react";

import "./ProductCategories.scss";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { BrandAPI } from "../../../store/apiBrand";

const DEFAULT_BRAND_LOGO =
  "https://placehold.co/200x200/f5f5f5/969696?text=No+Logo";
const FALLBACK_LOGO =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5Njk2OTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBMb2dvPC90ZXh0Pjwvc3ZnPg==";

const ProductCategories: React.FC = () => {
  const navigate = useNavigate();

  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      setError(null);
      const brandsData = await BrandAPI.getAll();
      console.log("brandsData",brandsData);
      setBrands(brandsData);
    } catch (err) {
      setError("Failed to load brands. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    navigate("/brands");
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <div className="product-categories-container">
      <h2 className="title">Products’ Brands</h2>

      <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
        {brands.map((brand) => (
          <Grid item key={brand.brandId} xs={6} sm={4} md={3} lg={2}>
            <Card
              sx={{
                border: "1px solid #ccc",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                "&:hover": {
                  transform: "scale(1.02)",
                  transition: "transform 0.2s ease-in-out",
                  boxShadow: 3,
                },
              }}
            >
              <CardActionArea
                onClick={() => handleClick()}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                }}
              >
                <CardMedia
                  component="img"
                  image={brand.brandImage || DEFAULT_BRAND_LOGO}
                  alt={brand.brandName}
                  sx={{
                    height: 120,
                    objectFit: "contain",
                    padding: 1,
                    backgroundColor: "#f5f5f5",
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    if (target.src !== FALLBACK_LOGO) {
                      target.src = FALLBACK_LOGO;
                    }
                  }}
                />
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "8px",
                    "&:last-child": { paddingBottom: "8px" },
                  }}
                >
                  <Typography
                    variant="body1"
                    align="center"
                    sx={{
                      fontWeight: "medium",
                      fontSize: "0.9rem",
                      lineHeight: 1.2,
                    }}
                  >
                    {brand.brandName}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ProductCategories;
