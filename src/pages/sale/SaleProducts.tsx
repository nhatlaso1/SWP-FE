import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Button,
  Container,
  CircularProgress,
  Alert,
  Rating,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ProductAPI } from '../../store/apiProduct';
import styles from './ProductList.module.css';

interface Product {
  $id: string;
  productId: number;
  productName: string;
  summary: string;
  price: number;
  discount: number;
  rating: number;
  productImage: string;
  brand: {
    brandName: string;
  };
}

const SaleProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const productsData = await ProductAPI.getAll();
        const saleProducts = productsData.filter((product: Product) => product.discount > 0);
        
        console.log('Sale Products:', saleProducts);
        setProducts(saleProducts);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load sale products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <div className={styles.productListContainer}>
      <Container maxWidth="xl">
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          Products On Sale
        </Typography>

        <Grid container spacing={3}>
          {/* Product Grid */}
          <Grid item xs={12}>
            {products.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No products on sale
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Check back later for great deals!
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={4}>
                {products.map((product) => (
                  <Grid item key={product.productId} xs={12} sm={6} md={4} lg={3}>
                    <Card 
                      className={styles.productCard}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          backgroundColor: 'error.main',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          zIndex: 1
                        }}
                      >
                        -{(product.discount * 100).toFixed(0)}%
                      </Box>
                      <CardMedia
                        className={styles.productImage}
                        component="img"
                        height="200"
                        image={product.productImage}
                        alt={product.productName}
                        onClick={() => navigate(`/product/${product.productId}`)}
                      />
                      <CardContent>
                        <Typography className={styles.productTitle} variant="h6" component="h2" noWrap>
                          {product.productName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Brand: {product.brand.brandName}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Rating value={product.rating} precision={0.1} readOnly size="small" />
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            ({product.rating})
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <Typography variant="h6" color="primary.main">
                            ${(product.price * (1 - product.discount)).toLocaleString()}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'text.secondary',
                              textDecoration: 'line-through'
                            }}
                          >
                            ${product.price.toLocaleString()}
                          </Typography>
                        </Box>
                        <Button 
                          className={styles.addToCartButton}
                          variant="contained" 
                          fullWidth
                        >
                          Add to Cart
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default SaleProducts; 