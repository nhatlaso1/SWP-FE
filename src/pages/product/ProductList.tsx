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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Pagination,
  SelectChangeEvent,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

import { useStore } from '../../store';
import { FilterAPI, callApi } from '../../store/apiFilter';
import styles from './ProductList.module.css';

// Interfaces for filter options
interface Category {
  categoryId: number;
  categoryName: string;
}
interface Brand {
  brandId: number;
  brandName: string;
}
interface FunctionType {
  functionId: number;
  functionName: string;
}
interface Ingredient {
  ingredientId: number;
  ingredientName: string;
}
interface SkinType {
  skinTypeId: number;
  skinTypeName: string;
}

// Interface for Product
interface Product {
  productId: number;
  productName: string;
  summary: string;
  quantity: number;
  price: number;
  discount: number; // discount as a decimal number, e.g., 0.1
  rating: number;
  productImage: string;
  brand: Brand;
  category: Category;
  skinTypes: { $values: SkinType[] };
  functions: { $values: FunctionType[] };
  ingredients: { $values: Ingredient[] };
  status: boolean;
}

// Interface for filter parameters sent to the API to fetch products
interface ProductFilterParams {
  pageIndex: number;
  pageSize: number;
  categoryIds: number | null;
  brandIds: number | null;
  functionIds: number | null;
  ingredients: number | null;
  skinTypeIds: number | null;
  minPrice: number;
  maxPrice: number | null;
}

/**
 * Utility function to parse the API response.
 * If the API returns data in the form { $values: [...] }, then return that array.
 */
function parseData(response: any): any[] {
  if (response && response.$values) return response.$values;
  if (Array.isArray(response)) return response;
  return [];
}

/**
 * Local filter function based on the selected criteria.
 */
function applyLocalFilter(products: Product[], filters: ProductFilterParams): Product[] {
  return products.filter((prod) => {
    if (!prod.status) return false; // Filter out inactive products
    if (filters.categoryIds && prod.category.categoryId !== filters.categoryIds) return false;
    if (filters.brandIds && prod.brand.brandId !== filters.brandIds) return false;
    if (
      filters.functionIds &&
      (!prod.functions?.$values ||
        !prod.functions.$values.some((func) => func.functionId === filters.functionIds))
    )
      return false;
    if (
      filters.ingredients &&
      (!prod.ingredients?.$values ||
        !prod.ingredients.$values.some((ing) => ing.ingredientId === filters.ingredients))
    )
      return false;
    if (
      filters.skinTypeIds &&
      (!prod.skinTypes?.$values ||
        !prod.skinTypes.$values.some((skin) => skin.skinTypeId === filters.skinTypeIds))
    )
      return false;
    if (prod.price < filters.minPrice) return false;
    if (filters.maxPrice !== null && prod.price > filters.maxPrice) return false;
    return true;
  });
}

const ProductList: React.FC = () => {
  // State for products, loading status, and error messages
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const localPageSize = 12;

  // Data for filter options (from FilterAPI)
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [functions, setFunctions] = useState<FunctionType[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [skinTypes, setSkinTypes] = useState<SkinType[]>([]);

  // User-selected filter values (default)
  const [filterParams, setFilterParams] = useState<ProductFilterParams>({
    pageIndex: 1,
    pageSize: 999, // Backend returns up to 999 products
    categoryIds: null,
    brandIds: null,
    functionIds: null,
    ingredients: null,
    skinTypeIds: null,
    minPrice: 0,
    maxPrice: null,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const addItem = useStore((store) => store.addItem);

  // When the component mounts, read currentPage from URL (if available)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const savedPage = Number(searchParams.get('currentPage')) || 1;
    fetchFilterOptions();
    fetchAllProducts(savedPage, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch filter options from FilterAPI
  const fetchFilterOptions = async () => {
    try {
      const { brands, categories, functions, ingredients, skinTypes } = await FilterAPI.getAllFilters();
      setCategories(categories || []);
      setBrands(brands || []);
      setFunctions(functions || []);
      setIngredients(ingredients || []);
      setSkinTypes(skinTypes || []);
    } catch (error) {
      console.error('Error fetching filter options:', error);
      setError('Could not load filter options.');
    }
  };

  /**
   * Calls the API to fetch all products.
   * Uses queryParams to request the backend to return all products (pageSize=999)
   * and bodyPayload with filters (or empty if reset).
   * Then applies local filtering (if not reset) and paginates with 10 products per page.
   */
  const fetchAllProducts = async (pageNumber: number, resetAll: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = {
        pageIndex: 1,
        pageSize: 999,
        sortColumn: 'productId',
        sortOrder: 'asc',
      };

      const bodyPayload = resetAll
        ? {} // If resetting, ignore filters
        : {
          BrandIds: filterParams.brandIds ? [filterParams.brandIds] : [],
          Categories: filterParams.categoryIds ? [filterParams.categoryIds] : [],
          FunctionIds: filterParams.functionIds ? [filterParams.functionIds] : [],
          Ingredients: filterParams.ingredients ? [filterParams.ingredients] : [],
          SkinTypes: filterParams.skinTypeIds ? [filterParams.skinTypeIds] : [],
          MinPrice: filterParams.minPrice || 0,
          MaxPrice: filterParams.maxPrice || 999999999,
          Status: true,
        };

      console.log('Query Params:', queryParams);
      console.log('Body Payload:', bodyPayload);

      const response: any = await callApi('post', '/Product/get-all-product', bodyPayload, queryParams);
      console.log('API Response:', response);

      const fullProducts: Product[] = parseData(response);
      const finalProducts = resetAll ? fullProducts : applyLocalFilter(fullProducts, filterParams);

      const totalItems = finalProducts.length;
      const computedTotalPages = Math.ceil(totalItems / localPageSize);
      const startIndex = (pageNumber - 1) * localPageSize;
      const paginatedProducts = finalProducts.slice(startIndex, startIndex + localPageSize);

      setProducts(paginatedProducts);
      setTotalPages(computedTotalPages);
      setCurrentPage(pageNumber);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Could not load product list.');
      setProducts([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  // Handle changes in filter fields
  const handleFilterChange =
    (key: keyof ProductFilterParams) =>
      (event: SelectChangeEvent<number | string>) => {
        const value = event.target.value === '' ? null : Number(event.target.value);
        setFilterParams((prev) => ({ ...prev, [key]: value }));
      };

  const handleMinPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterParams((prev) => ({
      ...prev,
      minPrice: Number(event.target.value) || 0,
    }));
  };

  const handleMaxPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterParams((prev) => ({
      ...prev,
      maxPrice: Number(event.target.value) || null,
    }));
  };

  // "Apply" button: use current filters, reset to page 1 and update the URL
  const handleApplyFilter = () => {
    navigate({ search: '?currentPage=1' });
    fetchAllProducts(1, false);
  };

  // "Reset" button: reset filter fields to default, update the URL and call API with empty body
  const handleReset = () => {
    setFilterParams({
      pageIndex: 1,
      pageSize: 999,
      categoryIds: null,
      brandIds: null,
      functionIds: null,
      ingredients: null,
      skinTypeIds: null,
      minPrice: 0,
      maxPrice: null,
    });
    navigate({ search: '?currentPage=1' });
    fetchAllProducts(1, true);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    navigate({ search: `?currentPage=${value}` });
    fetchAllProducts(value, false);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" align="center" sx={{ my: 4 }}>
        Product List
      </Typography>

      {/* Filter block */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={filterParams.categoryIds ?? ''}
              onChange={handleFilterChange('categoryIds')}
              label="Category"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.categoryId} value={cat.categoryId}>
                  {cat.categoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Brand</InputLabel>
            <Select
              value={filterParams.brandIds ?? ''}
              onChange={handleFilterChange('brandIds')}
              label="Brand"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {brands.map((brand) => (
                <MenuItem key={brand.brandId} value={brand.brandId}>
                  {brand.brandName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Function</InputLabel>
            <Select
              value={filterParams.functionIds ?? ''}
              onChange={handleFilterChange('functionIds')}
              label="Function"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {functions.map((func) => (
                <MenuItem key={func.functionId} value={func.functionId}>
                  {func.functionName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Ingredient</InputLabel>
            <Select
              value={filterParams.ingredients ?? ''}
              onChange={handleFilterChange('ingredients')}
              label="Ingredient"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {ingredients.map((ing) => (
                <MenuItem key={ing.ingredientId} value={ing.ingredientId}>
                  {ing.ingredientName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Skin Type</InputLabel>
            <Select
              value={filterParams.skinTypeIds ?? ''}
              onChange={handleFilterChange('skinTypeIds')}
              label="Skin Type"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {skinTypes.map((skin) => (
                <MenuItem key={skin.skinTypeId} value={skin.skinTypeId}>
                  {skin.skinTypeName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Min Price"
            type="number"
            sx={{ width: 120 }}
            value={filterParams.minPrice}
            onChange={handleMinPriceChange}
          />
          <TextField
            label="Max Price"
            type="number"
            sx={{ width: 120 }}
            value={filterParams.maxPrice ?? ''}
            onChange={handleMaxPriceChange}
          />
        </Box>

        {/* Apply & Reset Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button variant="contained" onClick={handleApplyFilter}>
            Apply
          </Button>
          <Button variant="contained" color="warning" onClick={handleReset}>
            Reset
          </Button>
        </Box>
      </Box>

      {/* Product list */}
      <Grid container spacing={3}>
        {products.length === 0 ? (
          <Typography variant="h6">No products found.</Typography>
        ) : (
          products.map((product) => {
            // Calculate final price if discount exists
            const hasDiscount = product.discount > 0;
            const finalPrice = hasDiscount ? product.price * (1 - product.discount) : product.price;
            return (
              <Grid item key={product.productId} xs={12} sm={6} md={4} lg={3}>
                <Card>
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
                    onClick={() =>
                      navigate(`/product/${product.productId}?currentPage=${currentPage}`)
                    }
                  />
                  <CardContent>
                    <Typography variant="h6" noWrap>
                      {product.productName}
                    </Typography>
                    <Typography variant="body2">
                      Brand: {product.brand.brandName}
                    </Typography>
                    <Rating value={product.rating} readOnly size="small" />
                    <Box sx={{ mt: 1 }}>
                      {hasDiscount ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="h6" color="error">
                            ${finalPrice.toLocaleString()}
                          </Typography>
                          <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'gray' }}>
                            ${product.price.toLocaleString()}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="h6">
                          ${product.price.toLocaleString()}
                        </Typography>
                      )}
                    </Box>
                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={() => {
                        console.log("Adding product to cart:", product);
                        addItem({
                          productId: product.productId,
                          productName: product.productName,
                          summary: product.summary,
                          price: product.price * (1 - product.discount),
                          discount: product.discount,
                          rating: product.rating,
                          productImage: product.productImage,
                          brand: product.brand?.brandName,
                          category: product.category?.categoryName,
                          // Pass skinTypes as an array: if product.skinTypes exists, extract $values, otherwise an empty array
                          skintype: product.skinTypes?.$values || [],
                          functions: product.functions?.$values || [],
                          ingredients: product.ingredients?.$values || [],
                          quantity: 1, // default quantity when adding to cart
                        });
                      }}
                    >
                      Add to Cart
                    </Button>


                  </CardContent>
                </Card>
              </Grid>
            );
          })
        )}
      </Grid>

      {/* Pagination (frontend): display if there are more than 10 products */}
      {totalPages > 1 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
};

export default ProductList;
