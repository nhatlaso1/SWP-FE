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
  CardActionArea
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ProductAPI } from '../../store/apiProduct';

// Định nghĩa interface cho Brand
interface Brand {
  $id: string;
  brandId: number;
  brandName: string;
}

// Cập nhật interface Product để thuộc tính brand là một object kiểu Brand
interface Product {
  $id: string;
  productId: number;
  productName: string;
  summary: string;
  price: number;
  discount: number;
  rating: number;
  productImage: string;
  brand: Brand;
}

interface PaginationData {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

const BrandList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  // selectedBrand ban đầu là null, nghĩa là chưa chọn brand nào
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      let currentPage = 1;
      let allFetchedProducts: Product[] = [];
      let hasMorePages = true;

      while (hasMorePages) {
        console.log('Fetching products for page:', currentPage);
        const response = await ProductAPI.getAll({
          pageIndex: currentPage,
          pageSize: 100, // Lấy 100 sản phẩm mỗi trang
          SortTypes: [""],
          CategoryIds: [],
          SizeTypes: [""],
          Ingredients: [],
          BrandIds: [],
          FunctionIds: [],
          MinPrice: 0,
          MaxPrice: 999999999,
          Status: true
        });

        if (response && response.products) {
          allFetchedProducts = [...allFetchedProducts, ...response.products];
          if (!response.pagination || currentPage >= response.pagination.totalPages) {
            hasMorePages = false;
          } else {
            currentPage++;
          }
        } else {
          hasMorePages = false;
        }
      }

      setProducts(allFetchedProducts);

      // Trích xuất danh sách tên brand duy nhất từ các sản phẩm
      const brandSet = new Set<string>();
      allFetchedProducts.forEach(product => {
        if (product.brand && product.brand.brandName) {
          brandSet.add(product.brand.brandName);
        }
      });
      setBrands(Array.from(brandSet));
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  // Hàm toggle chọn/deselect brand
  const handleBrandClick = (brand: string) => {
    if (selectedBrand === brand) {
      setSelectedBrand(null);
    } else {
      setSelectedBrand(brand);
    }
  };

  // Lọc sản phẩm theo brand nếu đã chọn
  const filteredProducts = selectedBrand 
    ? products.filter(product => product.brand.brandName === selectedBrand)
    : [];

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
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        align="center" 
        sx={{ mb: 4 }}
      >
        Products by Brand
      </Typography>

      <Typography variant="h6" align="center" sx={{ mb: 2 }}>
        Select a Brand:
      </Typography>

      {/* Hiển thị danh sách các brand dưới dạng Card */}
      <Grid container spacing={2} justifyContent="center">
        {brands.map((brand) => (
          <Grid item key={brand} xs={12} sm={6} md={4} lg={3}>
            <Card 
              sx={{
                border: selectedBrand === brand ? '2px solid #1976d2' : '1px solid #ccc',
              }}
            >
              <CardActionArea onClick={() => handleBrandClick(brand)}>
                <CardContent>
                  <Typography variant="h5" align="center">
                    {brand}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Nếu đã chọn brand thì hiển thị sản phẩm tương ứng */}
      {selectedBrand && (
        <>
          <Typography variant="h5" component="h2" align="center" sx={{ mt: 4, mb: 2 }}>
            Products for "{selectedBrand}"
          </Typography>
          {filteredProducts.length === 0 ? (
            <Typography variant="body1" align="center">
              No products found for the selected brand.
            </Typography>
          ) : (
            <Grid container spacing={4}>
              {filteredProducts.map((product) => (
                <Grid item key={product.productId} xs={12} sm={6} md={4} lg={3}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      position: 'relative',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        transition: 'transform 0.2s ease-in-out'
                      }
                    }}
                  >
                    {product.discount > 0 && (
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
                    )}
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Typography variant="h6" color="primary.main">
                          ${(product.price * (1 - product.discount)).toLocaleString()}
                        </Typography>
                        {product.discount > 0 && (
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'text.secondary',
                              textDecoration: 'line-through'
                            }}
                          >
                            ${product.price.toLocaleString()}
                          </Typography>
                        )}
                      </Box>
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
        </>
      )}

      {/* Nếu chưa chọn brand nào thì hiển thị thông báo nhắc chọn brand */}
      {!selectedBrand && (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          Please select a brand to view its products.
        </Typography>
      )}
    </Container>
  );
};

export default BrandList;
