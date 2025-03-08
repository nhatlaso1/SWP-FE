import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Container,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import { CombinedAPI } from '../../store/apiCombined';
import styles from '../brand/BrandList.module.css';
import "./BrandList";
interface ProductDetail {
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  discount: number;
  brand: {
    brandId: number;
    brandName: string;
  };
}

const BrandList: React.FC = () => {
  const [products, setProducts] = useState<ProductDetail[]>([]);
  const [originalProducts, setOriginalProducts] = useState<ProductDetail[]>([]);
  const [brands, setBrands] = useState<{ brandId: number; brandName: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);

  useEffect(() => {
    const fetchBrandsAndProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const { brands, products } = await CombinedAPI.getBrandsAndProducts();
        console.log('Brands and products data:', { brands, products });
        setBrands(brands);
        setProducts([]);
        setOriginalProducts(products);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchBrandsAndProducts();
  }, []);

  const handleBrandClick = (brandId: number) => {
    const filteredProducts = originalProducts.filter((product) => product.brand.brandId === brandId);
    console.log(`Products filtered by brandId ${brandId}:`, filteredProducts);
    setProducts(filteredProducts);
    setSelectedBrandId(brandId);
  };

  const clearFilter = () => {
    setProducts([]);
    setSelectedBrandId(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      </Container>
    );
  }

  return (
    <div className={styles.productListContainer}>
      <Container maxWidth="xl">
        <Typography variant="h4" align="center" sx={{ mb: 4 }}>Brands</Typography>
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {brands.map((brand) => (
            <Grid item key={brand.brandId} xs={6} sm={4} md={3}>
              <Card
                sx={{ cursor: 'pointer', textAlign: 'center', p: 2, backgroundColor: selectedBrandId === brand.brandId ? 'lightblue' : 'white' }}
                onClick={() => handleBrandClick(brand.brandId)}
              >
                <Typography variant="h6">{brand.brandName}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {products.length > 0 && (
          <Grid container spacing={4}>
            {products.map((product) => (
              <Grid item key={product.productId} xs={12} sm={6} md={4} lg={3}>
                <Card className={styles.productCard} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia component="img" image={product.productImage} alt={product.productName} sx={{ height: 140 }} />
                  <CardContent>
                    <Typography variant="h5">{product.productName}</Typography>
                    <Typography variant="body2">Price: {product.price} VND</Typography>
                    {product.discount > 0 && (
                      <Typography variant="body2" color="error">Discount: {product.discount * 100}%</Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </div>
  );
};

export default BrandList;
