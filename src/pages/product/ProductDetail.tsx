import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import styles from './ProductDetail.module.css';
import { useStore } from '../../store';

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
  customer: Customer;

}
interface Customer {
  $id: string;
  customerId: number;
  fullName: string

}
interface ProductDetail {
  $id: string;
  productId: number;
  productName: string;
  summary: string;
  size: string;
  price: number;
  discount: number; // discount dưới dạng số thập phân, ví dụ: 0.10 tương đương 10%
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
  const addItem = useStore((store) => store.addItem);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error state
        if (!id) {
          setError('Product ID is required');
          return;
        }

        const productId = parseInt(id);
        if (isNaN(productId)) {
          setError('Invalid product ID');
          return;
        }

        const data = await ProductAPI.getDetail(productId);
        if (!data) {
          setError('Product not found');
          return;
        }

        setProduct(data);
        if (data.productImages.$values.length > 0) {
          setSelectedImage(data.productImages.$values[0].productImage);
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

  const averageRating =
    product.feedbacks.$values.length > 0
      ? product.feedbacks.$values.reduce((acc, feedback) => acc + feedback.rating, 0) /
      product.feedbacks.$values.length
      : 0;

  // Tính giá sau discount: nếu có discount, finalPrice = price * (1 - discount)
  const hasDiscount = product.discount > 0;
  const finalPrice = hasDiscount ? product.price * (1 - product.discount) : product.price;

  return (
    <div className={styles.productDetailContainer}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card className={styles.mainImage}>
              <CardMedia
                component="img"
                height="400"
                image={selectedImage || product.productImages.$values[0].productImage}
                alt={product.productName}
                sx={{ objectFit: 'contain' }}
              />
            </Card>
            <ImageList className={styles.thumbnailList} cols={4} rowHeight={100}>
              {product.productImages.$values.map((image) => (
                <ImageListItem
                  key={image.productImageId}
                  className={`${styles.thumbnailItem} ${selectedImage === image.productImage ? styles.thumbnailSelected : ''
                    }`}
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
            <Typography variant="h4" className={styles.productTitle}>
              {product.productName}
            </Typography>

            <div className={styles.ratingContainer}>
              <Rating value={averageRating} precision={0.1} readOnly />
              <Typography variant="body2" color="text.secondary">
                ({averageRating.toFixed(1)}) · {product.feedbacks.$values.length} reviews
              </Typography>
            </div>

            {/* Giá sản phẩm: hiển thị giá sau discount, kèm theo giá gốc (gạch ngang) nếu có discount */}
            <div className={styles.priceContainer}>
              {hasDiscount ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h4" color="error">
                    ${finalPrice.toLocaleString()}
                  </Typography>
                  <Typography variant="h6" sx={{ textDecoration: 'line-through', color: 'gray' }}>
                    ${product.price.toLocaleString()}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="h4">
                  ${product.price.toLocaleString()}
                </Typography>
              )}
            </div>

            <Typography variant="body1" className={styles.summary}>
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

            <div className={styles.quantityContainer}>
              <Typography variant="subtitle1">Quantity:</Typography>
              <IconButton
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className={styles.quantityButton}
              >
                <RemoveIcon />
              </IconButton>
              <Typography>{quantity}</Typography>
              <IconButton
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= product.quantity}
                className={styles.quantityButton}
              >
                <AddIcon />
              </IconButton>
            </div>

            <Button
              variant="contained"
              size="large"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => {
                addItem({
                  productId: product.productId,
                  productName: product.productName,
                  price: product.price,
                  productImage: selectedImage || product.productImages.$values[0].productImage,
                  category: product.category.categoryName,
                  skintype: product.skinTypes.$values,
                  quantity: quantity, 
                });
              }}
            >
              Add to Cart
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Paper className={styles.infoSection}>
              <Typography variant="h6" className={styles.sectionTitle}>
                Suitable Skin Types
              </Typography>
              <div className={styles.chipContainer}>
                {product.skinTypes.$values.map((type) => (
                  <Chip
                    key={type.skinTypeId}
                    label={type.skinTypeName}
                    className={styles.chip}
                  />
                ))}
              </div>

              <Divider />

              <Typography variant="h6" className={styles.sectionTitle}>
                Functions
              </Typography>
              <div className={styles.chipContainer}>
                {product.functions.$values.map((func) => (
                  <Chip
                    key={func.functionId}
                    label={func.functionName}
                    className={styles.chip}
                  />
                ))}
              </div>

              <Divider />

              <Typography variant="h6" className={styles.sectionTitle}>
                Ingredients
              </Typography>
              <div className={styles.chipContainer}>
                {product.ingredients.$values.map((ingredient) => (
                  <Chip
                    key={ingredient.ingredientId}
                    label={ingredient.ingredientName}
                    className={styles.chip}
                  />
                ))}
              </div>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper className={styles.reviewSection}>
              <Typography variant="h6" className={styles.sectionTitle}>
                Customer Feedback & Ratings
              </Typography>
              {product.feedbacks.$values.length > 0 ? (
                <List>
                  {product.feedbacks.$values.map((feedback) => (
                    <ListItem key={feedback.feedbackId} className={styles.reviewItem}>
                      <Box sx={{ width: '100%' }}>
                      <Typography variant="body1" fontWeight="bold" className={styles.reviewText}>
                          {feedback.customer.fullName}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Rating value={feedback.rating} precision={0.1} readOnly size="small" />
                          <Typography variant="body2" className={styles.reviewDate}>
                            {new Date(feedback.createdDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Typography variant="body1" className={styles.reviewText}>
                          {feedback.comment}
                        </Typography>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body1" className={styles.noReviews}>
                  No reviews yet.
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default ProductDetail;
