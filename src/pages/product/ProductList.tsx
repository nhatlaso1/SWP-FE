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
import { CategoryAPI } from '../../store/apiCategory';
import styles from './ProductList.module.css';

interface Category {
  $id: string;
  categoryId: number;
  categoryName: string;
}

interface Product {
  $id: string;
  productId: number;
  productName: string;
  summary: string;
  price: number;
  discount: number;
  rating: number;
  productImage: string;
  categoryId: number;
}

const ProductList: React.FC = () => {
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
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <CircularProgress />
      </div>
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
        <Grid container spacing={3}>
          {/* Product Grid */}
          <Grid item xs={12}>
            {products.length === 0 ? (
              <div className={styles.noProducts}>
                <Typography variant="h6" gutterBottom>
                  No products found
                </Typography>
                <Typography variant="body1">
                  Check back later for new products.
                </Typography>
              </div>
            ) : (
              <Grid container spacing={4}>
                {products.map((product) => (
                  <Grid item key={product.productId} xs={12} sm={6} md={4} lg={3}>
                    <Card className={styles.productCard}>
                      <CardMedia
                        className={styles.productImage}
                        component="img"
                        image={product.productImage}
                        alt={product.productName}
                        onClick={() => navigate(`/product/${product.productId}`)}
                      />
                      <CardContent>
                        <Typography className={styles.productTitle} variant="h6" component="h2" noWrap>
                          {product.productName}
                        </Typography>
                        <div className={styles.ratingContainer}>
                          <Rating value={product.rating} precision={0.1} readOnly size="small" />
                          <Typography variant="body2" color="text.secondary">
                            ({product.rating})
                          </Typography>
                        </div>
                        <div className={styles.priceContainer}>
                          <span className={styles.price}>
                            ${product.price.toLocaleString()}
                          </span>
                          {product.discount > 0 && (
                            <span className={styles.discountPrice}>
                              ${(product.price * (1 + product.discount)).toLocaleString()}
                            </span>
                          )}
                        </div>
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

export default ProductList; 