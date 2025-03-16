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
import { useStore } from '../../store';

// Define interfaces for Brand, Category, and SkinType
interface Brand {
  $id: string;
  brandId: number;
  brandName: string;
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

const BrandList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  // Initially, no brand is selected
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const addItem = useStore((store) => store.addItem);
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
          pageSize: 100, // Fetch 100 products per page
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
          // Filter out inactive products
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

      // Extract unique brand names from the products
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

  // Toggle select/deselect brand
  const handleBrandClick = (brand: string) => {
    if (selectedBrand === brand) {
      setSelectedBrand(null);
    } else {
      setSelectedBrand(brand);
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
                          },
                        }}
                        onClick={() => {
                          console.log("Adding product to cart:", product);
                          addItem({
                            productId: product.productId,
                            productName: product.productName,
                            productImage: product.productImage,
                            // Use the category name from the product.category object
                            category: product.category?.categoryName || "",
                            // Extract skin types as an array from the product.skinTypes object
                            skintype: product.skinTypes?.$values || [],
                            // Calculate final price using discount (if any)
                            price: product.price * (1 - product.discount),
                            // Default quantity is 1 when adding to cart
                            quantity: 1,
                            // Use the product summary as an optional note
                            note: product.summary,
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
