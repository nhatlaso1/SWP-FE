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
import { BrandAPI } from '../../store/apiBrand';
import { useStore } from '../../store';

// Define interfaces for Brand, Category, and SkinType
interface Brand {
  $id: string;
  brandId: number;
  brandName: string;
  brandImage: string;
}

interface Category {
  $id: string;
  categoryId: number;
  categoryName: string;
}

interface SkinType {
  $id: string;
  skinTypeId: number;
  skinTypeName: string;
}

// Update Product interface to include category and skinTypes with proper formatting
interface Product {
  $id: string;
  productId: number;
  productName: string;
  summary: string;
  quantity: number;
  price: number;
  discount: number;
  rating: number;
  productImage: string;
  status: boolean; // true for active, false for inactive
  brand: Brand;
  category: Category;
  skinTypes: {
    $id: string;
    $values: SkinType[];
  };
}

interface PaginationData {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

// Default brand logo URL with fallback
const DEFAULT_BRAND_LOGO = 'https://placehold.co/200x200/f5f5f5/969696?text=No+Logo';
const FALLBACK_LOGO = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5Njk2OTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBMb2dvPC90ZXh0Pjwvc3ZnPg==';

const BrandList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const addItem = useStore((store) => store.addItem);
  const navigate = useNavigate();

  const fetchBrands = async () => {
    try {
      setLoading(true);
      setError(null);
      const brandsData = await BrandAPI.getAll();
      console.log('Fetched brands:', brandsData); // For debugging
      setBrands(brandsData);
    } catch (err) {
      console.error('Error fetching brands:', err);
      setError('Failed to load brands. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
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
          pageSize: 100,
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
          const activeProducts = response.products.filter(product => product.status === true);
          allFetchedProducts = [...allFetchedProducts, ...activeProducts];
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
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchBrands();
    fetchProducts();
  }, []);

  // Toggle select/deselect brand
  const handleBrandClick = (brandName: string) => {
    if (selectedBrand === brandName) {
      setSelectedBrand(null);
    } else {
      setSelectedBrand(brandName);
    }
  };

  // Filter products by selected brand
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

      {/* Display brand list as Cards */}
      <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
        {brands.map((brand) => (
          <Grid item key={brand.brandId} xs={6} sm={4} md={3} lg={2}>
            <Card
              sx={{
                border: selectedBrand === brand.brandName ? '2px solid #1976d2' : '1px solid #ccc',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  transform: 'scale(1.02)',
                  transition: 'transform 0.2s ease-in-out',
                  boxShadow: 3
                }
              }}
            >
              <CardActionArea
                onClick={() => handleBrandClick(brand.brandName)}
                sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
              >
                <CardMedia
                  component="img"
                  image={brand.brandImage || DEFAULT_BRAND_LOGO}
                  alt={brand.brandName}
                  sx={{
                    height: 120,
                    objectFit: 'contain',
                    padding: 1,
                    backgroundColor: '#f5f5f5'
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    if (target.src !== FALLBACK_LOGO) {
                      target.src = FALLBACK_LOGO;
                    }
                  }}
                />
                <CardContent sx={{
                  flexGrow: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px',
                  '&:last-child': { paddingBottom: '8px' }
                }}>
                  <Typography
                    variant="body1"
                    align="center"
                    sx={{
                      fontWeight: 'medium',
                      fontSize: '0.9rem',
                      lineHeight: 1.2
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

      {/* If a brand is selected, display its products */}
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
                      image={product.productImage}
                      alt={product.productName}
                      sx={{
                        width: '100%',
                        aspectRatio: '1/1',
                        objectFit: 'cover',
                        cursor: 'pointer'
                      }}
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
                          {(product.price * (1 - product.discount)).toLocaleString()} VND
                        </Typography>
                        {product.discount > 0 && (
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'text.secondary',
                              textDecoration: 'line-through'
                            }}
                          >
                            {product.price.toLocaleString()} VND
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
                          },
                        }}
                        onClick={() => {
                          console.log("Adding product to cart:", product);
                          addItem({
                            productId: product.productId,
                            productName: product.productName,
                            productImage: product.productImage,
                            category: product.category?.categoryName || "",
                            skintype: product.skinTypes?.$values || [],
                            price: product.price * (1 - product.discount),
                            quantity: 1,
                            //    note: product.summary,
                          });
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

      {/* If no brand is selected, prompt user to select one */}
      {!selectedBrand && (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          Please select a brand to view its products.
        </Typography>
      )}
    </Container>
  );
};

export default BrandList;
