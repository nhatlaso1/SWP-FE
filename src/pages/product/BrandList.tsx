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
import { ProductAPI } from '../../store/apiProduct';
import { BrandAPI } from '../../store/apiBrand';
import styles from './ProductList.module.css';

interface ProductDetail {
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  discount: number;
  brandId: number;
  brand: {
    brandId: number;
    brandName: string;
  };
}

const BrandList: React.FC = () => {
  const [products, setProducts] = useState<ProductDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [brands, setBrands] = useState<{ brandId: number; brandName: string }[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      setError(null);
      const brandsData = await BrandAPI.getAll();
      setBrands(brandsData);
    } catch (error) {
      console.error('Error fetching brands:', error);
      setError('Failed to load brands. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsByBrand = async (brandId: number) => {
    try {
      setLoading(true);
      setError(null);
      const productsData = await ProductAPI.getProductsByBrand(brandId);
      setProducts(productsData);
      setSelectedBrandId(brandId);
    } catch (error) {
      console.error('Error fetching products by brand:', error);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleBrandClick = (brandId: number) => {
    fetchProductsByBrand(brandId);
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
          Brands
        </Typography>

        <Grid container spacing={4} sx={{ mb: 4 }}>
          {brands.map((brand) => (
            <Grid item key={brand.brandId} xs={6} sm={4} md={3} onClick={() => handleBrandClick(brand.brandId)}>
              <Card 
                sx={{ 
                  cursor: 'pointer', 
                  textAlign: 'center', 
                  p: 2, 
                  backgroundColor: selectedBrandId === brand.brandId ? 'lightblue' : 'white' 
                }}>
                <Typography variant="h6">{brand.brandName}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {selectedBrandId !== null && (
          <Box textAlign="center" sx={{ mb: 4 }}>
            <Button variant="outlined" onClick={clearFilter}>
              Clear Filter
            </Button>
          </Box>
        )}

        {products.length > 0 && selectedBrandId !== null && (
          <>
            <Typography variant="h5" sx={{ mb: 4, textAlign: 'center' }}>
              Products
            </Typography>
            <Grid container spacing={4}>
              {products.map((product) => (
                <Grid item key={product.productId} xs={12} sm={6} md={4} lg={3}>
                  <Card className={styles.productCard} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardMedia
                      component="img"
                      image={product.productImage}
                      alt={product.productName}
                      sx={{ height: 140 }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" component="h2" gutterBottom>
                        {product.productName}
                      </Typography>
                      <Typography variant="body2">
                        Price: {product.price} VND
                      </Typography>
                      {product.discount > 0 && (
                        <Typography variant="body2" color="error">
                          Discount: {product.discount * 100}%
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Container>
    </div>
  );
};

export default BrandList;
