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
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Rating
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ProductAPI } from '../../store/apiProduct';
import { CategoryAPI } from '../../store/apiCategory';

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [productsData, categoriesResponse] = await Promise.all([
          ProductAPI.getAll(),
          CategoryAPI.getAll()
        ]);

        const categoriesData = categoriesResponse.$values || [];

        console.log('Products Data:', productsData);
        console.log('Categories Data:', categoriesData);

        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategoryChange = (_event: React.SyntheticEvent, newValue: number | 'all') => {
    console.log('Selected Category:', newValue);
    setSelectedCategory(newValue);
  };

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => {
        console.log('Filtering product:', product);
        return product.categoryId === selectedCategory;
      });

  console.log('Filtered Products:', filteredProducts);

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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {categories.length > 0 && (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs 
            value={selectedCategory} 
            onChange={handleCategoryChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="All Products" value="all" />
            {categories.map((category) => (
              <Tab key={category.categoryId} label={category.categoryName} value={category.categoryId} />
            ))}
          </Tabs>
        </Box>
      )}

      {filteredProducts.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No products found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {error ? 'There was an error loading the products.' : 'Try changing the category filter or check back later.'}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {filteredProducts.map((product) => (
            <Grid item key={product.productId} xs={12} sm={6} md={4} lg={3}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    transition: 'transform 0.2s ease-in-out'
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={product.productImage}
                  alt={product.productName}
                  sx={{ objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => navigate(`/product/${product.productId}`)}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2" noWrap>
                    {product.productName}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={product.rating} precision={0.1} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({product.rating})
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
                    ${product.price.toLocaleString()}
                    {product.discount > 0 && (
                      <Typography
                        component="span"
                        sx={{
                          color: 'error.main',
                          ml: 1,
                          textDecoration: 'line-through'
                        }}
                      >
                        ${(product.price * (1 + product.discount)).toLocaleString()}
                      </Typography>
                    )}
                  </Typography>
                  <Button 
                    variant="contained" 
                    fullWidth
                    sx={{
                      mt: 'auto',
                      backgroundColor: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      }
                    }}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ProductList; 