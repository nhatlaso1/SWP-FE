import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardMedia,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  CircularProgress,
  Alert,
  Rating,
  Chip,
  Stack,
  ImageList,
  ImageListItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { ProductAPI } from '../../store/apiProduct';

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

interface ProductImage {
  $id: string;
  productImageId: number;
  productImage: string;
}

interface SkinType {
  $id: string;
  skinTypeId: number;
  skinTypeName: string;
}

interface ProductFunction {
  $id: string;
  functionId: number;
  functionName: string;
}

interface Ingredient {
  $id: string;
  ingredientId: number;
  ingredientName: string;
}

interface Feedback {
  $id: string;
  feedbackId: number;
  rating: number;
  comment: string;
  createdDate: string;
}

interface ProductDetail {
  $id: string;
  productId: number;
  productName: string;
  summary: string;
  size: string;
  price: number;
  discount: number;
  quantity: number;
  brand: Brand;
  category: Category;
  productImages: {
    $id: string;
    $values: ProductImage[];
  };
  skinTypes: {
    $id: string;
    $values: SkinType[];
  };
  functions: {
    $id: string;
    $values: ProductFunction[];
  };
  ingredients: {
    $id: string;
    $values: Ingredient[];
  };
  feedbacks: {
    $id: string;
    $values: Feedback[];
  };
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        if (id) {
          const data = await ProductAPI.getDetail(parseInt(id));
          setProduct(data);
          if (data.productImages.$values.length > 0) {
            setSelectedImage(data.productImages.$values[0].productImage);
          }
        }
      } catch (error) {
        console.error('Error fetching product detail:', error);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id]);

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.quantity || 1)) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          {error || 'Product not found'}
        </Alert>
      </Container>
    );
  }

  const averageRating = product.feedbacks.$values.length > 0
    ? product.feedbacks.$values.reduce((acc, feedback) => acc + feedback.rating, 0) / product.feedbacks.$values.length
    : 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="400"
              image={selectedImage || product.productImages.$values[0].productImage}
              alt={product.productName}
              sx={{ objectFit: 'contain' }}
            />
          </Card>
          <ImageList sx={{ mt: 2 }} cols={4} rowHeight={100}>
            {product.productImages.$values.map((image) => (
              <ImageListItem 
                key={image.productImageId}
                sx={{ 
                  cursor: 'pointer',
                  border: selectedImage === image.productImage ? '2px solid primary.main' : 'none'
                }}
                onClick={() => setSelectedImage(image.productImage)}
              >
                <img
                  src={image.productImage}
                  alt={`${product.productName}-${image.productImageId}`}
                  loading="lazy"
                  style={{ height: '100%', objectFit: 'cover' }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            {product.productName}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={averageRating} precision={0.1} readOnly />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({averageRating.toFixed(1)}) · {product.feedbacks.$values.length} reviews
            </Typography>
          </Box>
          
          <Typography variant="h5" color="primary" gutterBottom>
            ${product.price.toLocaleString()}
            {product.discount > 0 && (
              <Typography
                component="span"
                variant="h6"
                sx={{
                  color: 'error.main',
                  ml: 2,
                  textDecoration: 'line-through'
                }}
              >
                ${(product.price * (1 + product.discount)).toLocaleString()}
              </Typography>
            )}
          </Typography>

          <Typography variant="body1" paragraph>
            {product.summary}
          </Typography>

          <List>
            <ListItem>
              <ListItemText primary="Size" secondary={product.size} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Brand" secondary={product.brand.brandName} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Category" secondary={product.category.categoryName} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Available Quantity" secondary={product.quantity} />
            </ListItem>
          </List>

          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Quantity:</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                <RemoveIcon />
              </IconButton>
              <Typography>{quantity}</Typography>
              <IconButton onClick={() => handleQuantityChange(1)} disabled={quantity >= product.quantity}>
                <AddIcon />
              </IconButton>
            </Box>
          </Box>

          <Button 
            variant="contained" 
            size="large" 
            fullWidth 
            sx={{ mt: 2 }}
          >
            Add to Cart
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3, mt: 4 }}>
            <Typography variant="h6" gutterBottom>Suitable Skin Types</Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
              {product.skinTypes.$values.map((type) => (
                <Chip key={type.skinTypeId} label={type.skinTypeName} />
              ))}
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>Functions</Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
              {product.functions.$values.map((func) => (
                <Chip key={func.functionId} label={func.functionName} />
              ))}
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>Ingredients</Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
              {product.ingredients.$values.map((ingredient) => (
                <Chip key={ingredient.ingredientId} label={ingredient.ingredientName} />
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3, mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Customer Feedback & Ratings
            </Typography>
            {product.feedbacks.$values.length > 0 ? (
              <List>
                {product.feedbacks.$values.map((feedback) => (
                  <ListItem key={feedback.feedbackId} divider>
                    <Box sx={{ width: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Rating value={feedback.rating} precision={0.1} readOnly size="small" />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          {new Date(feedback.createdDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Typography variant="body1">
                        {feedback.comment}
                      </Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No reviews yet.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail; 