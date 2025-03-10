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

// Interfaces cho filter options
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

// Interface cho sản phẩm
interface Product {
  productId: number;
  productName: string;
  summary: string;
  quantity: number;
  price: number;
  discount: number; // discount dưới dạng số thập phân, ví dụ: 0.1
  rating: number;
  productImage: string;
  brand: Brand;
  category: Category;
  skinTypes: { $values: SkinType[] };
  functions: { $values: FunctionType[] };
  ingredients: { $values: Ingredient[] };
}

// Interface cho filter parameters khi gửi lên API lấy sản phẩm
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
 * Hàm tiện ích parse dữ liệu trả về từ API.
 * Nếu API trả về dữ liệu dạng { $values: [...] } thì trả về mảng đó.
 */
function parseData(response: any): any[] {
  if (response && response.$values) return response.$values;
  if (Array.isArray(response)) return response;
  return [];
}

/**
 * Hàm filter nội bộ dựa trên các tiêu chí được chọn.
 */
function applyLocalFilter(products: Product[], filters: ProductFilterParams): Product[] {
  return products.filter((prod) => {
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
  // State cho sản phẩm, trạng thái tải và lỗi
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Phân trang frontend: mỗi trang 10 sản phẩm
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const localPageSize = 10;

  // Dữ liệu filter (lấy từ FilterAPI)
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [functions, setFunctions] = useState<FunctionType[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [skinTypes, setSkinTypes] = useState<SkinType[]>([]);

  // Giá trị filter người dùng chọn (mặc định)
  const [filterParams, setFilterParams] = useState<ProductFilterParams>({
    pageIndex: 1,
    pageSize: 999, // Backend trả về tối đa 999 sản phẩm
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

  // Khi component mount, đọc currentPage từ URL (nếu có)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const savedPage = Number(searchParams.get('currentPage')) || 1;
    fetchFilterOptions();
    fetchAllProducts(savedPage, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lấy dữ liệu filter từ FilterAPI
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
      setError('Không thể tải dữ liệu filter.');
    }
  };

  /**
   * Gọi API để lấy toàn bộ sản phẩm.
   * Sử dụng queryParams để yêu cầu backend trả về toàn bộ sản phẩm (pageSize=999)
   * và bodyPayload chứa các filter (hoặc rỗng nếu reset).
   * Sau đó áp dụng local filter (nếu không reset) và phân trang với 10 sản phẩm/trang.
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
        ? {} // Khi reset, bỏ qua filter
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
      setError('Không thể tải danh sách sản phẩm.');
      setProducts([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý thay đổi các trường filter
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

  // Nút "Áp dụng": sử dụng filter hiện tại, reset về trang 1 và cập nhật URL
  const handleApplyFilter = () => {
    navigate({ search: '?currentPage=1' });
    fetchAllProducts(1, false);
  };

  // Nút "Đặt lại": reset các trường filter về mặc định, cập nhật URL và gọi API với body rỗng
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
        Danh sách sản phẩm
      </Typography>

      {/* Khối filter */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Danh mục</InputLabel>
            <Select
              value={filterParams.categoryIds ?? ''}
              onChange={handleFilterChange('categoryIds')}
              label="Danh mục"
            >
              <MenuItem value="">
                <em>Không chọn</em>
              </MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.categoryId} value={cat.categoryId}>
                  {cat.categoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Thương hiệu</InputLabel>
            <Select
              value={filterParams.brandIds ?? ''}
              onChange={handleFilterChange('brandIds')}
              label="Thương hiệu"
            >
              <MenuItem value="">
                <em>Không chọn</em>
              </MenuItem>
              {brands.map((brand) => (
                <MenuItem key={brand.brandId} value={brand.brandId}>
                  {brand.brandName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Chức năng</InputLabel>
            <Select
              value={filterParams.functionIds ?? ''}
              onChange={handleFilterChange('functionIds')}
              label="Chức năng"
            >
              <MenuItem value="">
                <em>Không chọn</em>
              </MenuItem>
              {functions.map((func) => (
                <MenuItem key={func.functionId} value={func.functionId}>
                  {func.functionName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Thành phần</InputLabel>
            <Select
              value={filterParams.ingredients ?? ''}
              onChange={handleFilterChange('ingredients')}
              label="Thành phần"
            >
              <MenuItem value="">
                <em>Không chọn</em>
              </MenuItem>
              {ingredients.map((ing) => (
                <MenuItem key={ing.ingredientId} value={ing.ingredientId}>
                  {ing.ingredientName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Loại da</InputLabel>
            <Select
              value={filterParams.skinTypeIds ?? ''}
              onChange={handleFilterChange('skinTypeIds')}
              label="Loại da"
            >
              <MenuItem value="">
                <em>Không chọn</em>
              </MenuItem>
              {skinTypes.map((skin) => (
                <MenuItem key={skin.skinTypeId} value={skin.skinTypeId}>
                  {skin.skinTypeName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Giá tối thiểu"
            type="number"
            sx={{ width: 120 }}
            value={filterParams.minPrice}
            onChange={handleMinPriceChange}
          />
          <TextField
            label="Giá tối đa"
            type="number"
            sx={{ width: 120 }}
            value={filterParams.maxPrice ?? ''}
            onChange={handleMaxPriceChange}
          />
        </Box>

        {/* Nút Áp dụng & Đặt lại nằm cùng một hàng */}
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button variant="contained" onClick={handleApplyFilter}>
            Áp dụng
          </Button>
          <Button variant="contained" color="warning" onClick={handleReset}>
            Đặt lại
          </Button>
        </Box>
      </Box>

      {/* Danh sách sản phẩm */}
      <Grid container spacing={3}>
        {products.length === 0 ? (
          <Typography variant="h6">Không tìm thấy sản phẩm.</Typography>
        ) : (
          products.map((product) => {
            // Tính giá cuối cùng nếu có discount
            const hasDiscount = product.discount > 0;
            const finalPrice = hasDiscount ? product.price * (1 - product.discount) : product.price;
            return (
              <Grid item key={product.productId} xs={12} sm={6} md={4} lg={3}>
                <Card>
                  <CardMedia
                    component="img"
                    image={product.productImage}
                    alt={product.productName}
                    sx={{ height: 200, cursor: 'pointer' }}
                    onClick={() =>
                      navigate(`/product/${product.productId}?currentPage=${currentPage}`)
                    }
                  />
                  <CardContent>
                    <Typography variant="h6" noWrap>
                      {product.productName}
                    </Typography>
                    <Typography variant="body2">
                      Thương hiệu: {product.brand.brandName}
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
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={() =>
                        addItem({
                          productId: product.productId,
                          productName: product.productName,
                          price: product.price,
                          productImage: product.productImage,
                        })
                      }
                    >
                      Thêm vào giỏ
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        )}
      </Grid>

      {/* Phân trang (frontend): hiển thị nếu có nhiều hơn 10 sản phẩm */}
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
