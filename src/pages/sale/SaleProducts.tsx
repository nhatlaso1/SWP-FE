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
import { useStore } from '../../store';

// Interface for Brand (already defined)
export interface Brand {
  $id: string;
  brandId: number;
  brandName: string;
}

// Interface for Category
export interface Category {
  $id: string;
  categoryId: number;
  categoryName: string;
}

// Interface for SkinType
export interface SkinType {
  $id: string;
  skinTypeId: number;
  skinTypeName: string;
}

// Interface for Product, following a structure similar to Brand
export interface Product {
  $id: string;
  productId: number;
  productName: string;
  summary: string;
  price: number;
  discount: number; // Discount as a decimal (e.g., 0.2 equals 20%)
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

const SaleProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const addItem = useStore((store) => store.addItem);

  // Fetch all products that have a discount > 0
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
          Status: true,
        });

        if (response && response.products) {
          // Filter products with discount > 0 and active status
          const discountedProducts = response.products.filter(
            (product: Product) => product.discount > 0 && product.status === true
          );
          allFetchedProducts = [...allFetchedProducts, ...discountedProducts];

          // Check if we've reached the last page
          if (!response.pagination || currentPage >= response.pagination.totalPages) {
            hasMorePages = false;
          } else {
            currentPage++;
          }
        } else {
          hasMorePages = false;
        }
      }

      console.log('Total products with discount found:', allFetchedProducts.length);
      setProducts(allFetchedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load sale products. Please try again later.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Products On Sale
      </Typography>

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
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    transition: 'transform 0.2s ease-in-out',
                  },
                }}
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
                    zIndex: 1,
                  }}
                >
                  -{(product.discount * 100).toFixed(0)}%
                </Box>
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
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        textDecoration: 'line-through',
                      }}
                    >
                      ${product.price.toLocaleString()}
                    </Typography>
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
                      // Pass all required fields to addItem. Since this API response does not include
                      // category or skinTypes (or they might be in the response), we pass default values.
                      addItem({
                        productId: product.productId,
                        productName: product.productName,
                        productImage: product.productImage,
                        // Use the category name from product.category, or default to an empty string
                        category: product.category?.categoryName || "",
                        // Extract skin types as an array, or pass an empty array if not provided
                        skintype: product.skinTypes?.$values || [],
                        // Calculate effective price after discount
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
    </Container>
  );
};

export default SaleProducts;
