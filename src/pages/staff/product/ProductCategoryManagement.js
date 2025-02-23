import React, { useState, useEffect } from 'react';
import { ProductAPI } from '../../../store/apiProductCategory';
import './ProductCategoryManagement.css';

const ProductCategoryManagement = () => {
  // Danh mục và sản phẩm
  const [categories, setCategories] = useState([
    { id: 1, name: 'Cleansers', description: 'Các sản phẩm làm sạch da' },
    { id: 2, name: 'Exfoliators', description: 'Các sản phẩm tẩy tế bào chết' },
    { id: 3, name: 'Toners', description: 'Các loại toner cân bằng da' },
    { id: 4, name: 'Retinols', description: 'Các sản phẩm chứa retinol' },
    { id: 5, name: 'Peels and Masques', description: 'Mặt nạ và sản phẩm lột da' },
    { id: 6, name: 'Moisturizers', description: 'Các loại kem dưỡng ẩm' },
    { id: 7, name: 'Night Creams', description: 'Kem dưỡng ban đêm' },
    { id: 8, name: 'Facial Oils', description: 'Các loại dầu dưỡng da' },
    { id: 9, name: 'Sunscreens', description: 'Kem chống nắng' },
    { id: 10, name: 'Eye Care', description: 'Chăm sóc vùng mắt' }
  ]);
  const [products, setProducts] = useState([]);

  // State cho form sản phẩm
  const [showProductForm, setShowProductForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    categoryId: '',
    price: '',
    stock: '',
    image: '',
    description: '',
    ingredients: '',
    capacity: '',
    status: 'active'
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    categoryId: '',
    price: '',
    stock: ''
  });

  // State cho form danh mục sản phẩm
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: ''
  });
  const [categoryFormErrors, setCategoryFormErrors] = useState({});

  // State loading, error, notification
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  // Thêm state cho modal chi tiết
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Hàm tạo ID mới cho danh mục (chỉ sử dụng nội bộ)
  const generateId = (items) => items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;

  // Fetch danh sách sản phẩm khi component mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('Fetching products...');
        const response = await ProductAPI.getAll(1, 10);
        console.log('Raw Products Response:', JSON.stringify(response, null, 2));
        console.log('Products response details:', {
          response,
          type: typeof response,
          isArray: Array.isArray(response),
          values: response?.$values,
          length: response?.length
        });

        if (Array.isArray(response)) {
          console.log('Setting products:', response);
          setProducts(response);
          if (response.length === 0) {
            showNotificationMessage('Chưa có sản phẩm nào trong hệ thống');
          }
        } else {
          console.warn('Invalid response format:', response);
          setProducts([]);
          setError('Dữ liệu không hợp lệ');
        }
      } catch (err) {
        console.error('Fetch Error:', err);
        setError('Không thể kết nối đến server. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Validation form sản phẩm
  const validateProductForm = (form) => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Tên sản phẩm là bắt buộc';
    if (!form.categoryId) errors.categoryId = 'Vui lòng chọn danh mục';
    if (!form.price || form.price <= 0) errors.price = 'Giá phải lớn hơn 0';
    if (!form.stock || form.stock < 0) errors.stock = 'Số lượng không hợp lệ';
    return errors;
  };

  const showNotificationMessage = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // Xử lý thêm sản phẩm
  const handleAddProduct = async (e) => {
    e.preventDefault();

    const errors = validateProductForm(productForm);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const newProduct = await ProductAPI.create(productForm);
      setProducts(prev => [...prev, newProduct]);
      showNotificationMessage('Thêm sản phẩm thành công!');
      setShowProductForm(false);
    } catch (err) {
      setError('Không thể thêm sản phẩm');
    }

    // Reset form sản phẩm
    setProductForm({
      name: '',
      categoryId: '',
      price: '',
      stock: '',
      image: '',
      description: '',
      ingredients: '',
      capacity: '',
      status: 'active'
    });
  };

  // Xử lý chỉnh sửa sản phẩm
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setProductForm(product);
    setShowProductForm(true);
  };

  // Xử lý cập nhật sản phẩm
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const updatedProduct = await ProductAPI.update(selectedProduct.id, productForm);
      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      showNotificationMessage('Cập nhật sản phẩm thành công!');
    } catch (err) {
      setError('Không thể cập nhật sản phẩm');
    }
    // Reset form
    setProductForm({
      name: '',
      categoryId: '',
      price: '',
      stock: '',
      image: '',
      description: '',
      ingredients: '',
      capacity: '',
      status: 'active'
    });
    setSelectedProduct(null);
    setShowProductForm(false);
  };

  // Xử lý active/inactive sản phẩm
  const handleActivateProduct = async (productId) => {
    try {
      const updatedProduct = await ProductAPI.activate(productId);
      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      showNotificationMessage('Kích hoạt sản phẩm thành công!');
    } catch (err) {
      setError('Không thể kích hoạt sản phẩm');
    }
  };

  const handleDeactivateProduct = async (productId) => {
    try {
      const updatedProduct = await ProductAPI.deactivate(productId);
      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      showNotificationMessage('Ngừng kích hoạt sản phẩm thành công!');
    } catch (err) {
      setError('Không thể ngừng kích hoạt sản phẩm');
    }
  };

  // Xử lý lấy chi tiết sản phẩm
  const handleGetProductDetail = async (productId) => {
    try {
      setLoading(true);
      const productDetail = await ProductAPI.getDetail(productId);
      console.log('Product detail:', productDetail);
      
      setSelectedProduct(productDetail);
      setShowDetailModal(true); // Thay vì setShowProductForm
      
      showNotificationMessage('Lấy chi tiết sản phẩm thành công!');
    } catch (err) {
      console.error('Error getting product detail:', err);
      setError('Không thể lấy chi tiết sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý thêm danh mục sản phẩm (chỉ xử lý nội bộ)
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      setCategoryFormErrors({ name: 'Tên danh mục là bắt buộc' });
      return;
    }
    const newCategory = {
      id: generateId(categories),
      name: categoryForm.name,
      description: categoryForm.description
    };
    setCategories(prev => [...prev, newCategory]);
    showNotificationMessage('Thêm danh mục thành công!');
    setCategoryForm({ name: '', description: '' });
    setCategoryFormErrors({});
    setShowCategoryForm(false);
  };

  // Thêm error boundary
  const ErrorFallback = ({ error }) => (
    <div className="error-container">
      <h2>Đã xảy ra lỗi!</h2>
      <pre>{error.message}</pre>
      <button onClick={() => window.location.reload()}>Thử lại</button>
    </div>
  );

  // Thêm xử lý fallback khi không có hình ảnh
  const ProductImage = ({ src, alt }) => {
    const [hasError, setHasError] = useState(false);

    return (
      <>
        {!hasError && src ? (
          <img 
            src={src} 
            alt={alt}
            onError={() => setHasError(true)}
          />
        ) : (
          <div className="placeholder-image">No Image</div>
        )}
      </>
    );
  };

  return (
    <div className="product-category-management">
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">Đang tải dữ liệu...</div>
      ) : (
        <div className="management-header">
          <h1>Quản lý Sản phẩm</h1>
          <div className="header-actions">
            <button onClick={() => { setShowProductForm(true); setSelectedProduct(null); }}>
              Thêm sản phẩm
            </button>
            <button onClick={() => setShowCategoryForm(true)}>
              Thêm danh mục
            </button>
          </div>
        </div>
      )}

      {/* Modal thêm/sửa sản phẩm */}
      {showProductForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
            <form onSubmit={selectedProduct ? handleUpdateProduct : handleAddProduct}>
              <div className="form-group">
                <label>
                  Tên sản phẩm: <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => {
                    setProductForm({ ...productForm, name: e.target.value });
                    if (formErrors.name) {
                      setFormErrors({ ...formErrors, name: '' });
                    }
                  }}
                  className={formErrors.name ? 'error' : ''}
                />
                {formErrors.name && <span className="error-text">{formErrors.name}</span>}
              </div>
              <div className="form-group">
                <label>Danh mục:</label>
                <select
                  value={productForm.categoryId}
                  onChange={(e) => setProductForm({ ...productForm, categoryId: Number(e.target.value) })}
                  required
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Giá:</label>
                <input
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Số lượng tồn kho:</label>
                <input
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Dung tích :</label>
                <input
                  type="text"
                  value={productForm.capacity}
                  onChange={(e) => setProductForm({ ...productForm, capacity: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Mô tả:</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Thành phần:</label>
                <textarea
                  value={productForm.ingredients}
                  onChange={(e) => setProductForm({ ...productForm, ingredients: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Hình ảnh:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    // Xử lý upload hình ảnh nếu cần
                    console.log('File selected:', e.target.files[0]);
                  }}
                />
              </div>
              <div className="form-actions">
                <button type="submit">
                  {selectedProduct ? 'Cập nhật' : 'Thêm mới'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowProductForm(false);
                    setProductForm({
                      name: '',
                      categoryId: '',
                      price: '',
                      stock: '',
                      image: '',
                      description: '',
                      ingredients: '',
                      capacity: '',
                      status: 'active'
                    });
                  }}
                  className="cancel-button"
                >
                  Đóng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal thêm danh mục sản phẩm */}
      {showCategoryForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>Thêm danh mục sản phẩm</h2>
            <form onSubmit={handleAddCategory}>
              <div className="form-group">
                <label>
                  Tên danh mục: <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => {
                    setCategoryForm({ ...categoryForm, name: e.target.value });
                    if (categoryFormErrors.name) {
                      setCategoryFormErrors({ ...categoryFormErrors, name: '' });
                    }
                  }}
                  className={categoryFormErrors.name ? 'error' : ''}
                />
                {categoryFormErrors.name && <span className="error-text">{categoryFormErrors.name}</span>}
              </div>
              <div className="form-group">
                <label>Mô tả:</label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                />
              </div>
              <div className="form-actions">
                <button type="submit">Thêm mới</button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCategoryForm(false);
                    setCategoryForm({ name: '', description: '' });
                    setCategoryFormErrors({});
                  }}
                  className="cancel-button"
                >
                  Đóng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hiển thị danh sách */}
      <div className="management-content">
        {/* Danh sách danh mục */}
        <div className="categories-section">
          <h2>Danh mục sản phẩm</h2>
          <div className="categories-grid">
            {categories.length > 0 ? (
              categories.map((category) => (
                <div key={category.id} className="category-card">
                  {category.image && <img src={category.image} alt={category.name} />}
                  <div className="category-info">
                    <h3>{category.name}</h3>
                    <p>{category.description}</p>
                    <span className="product-count">
                      {Array.isArray(products) ? 
                        products.filter(p => p.categoryId === category.id).length : 0} sản phẩm
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p>Chưa có danh mục nào</p>
            )}
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="products-section">
          <h2>Sản phẩm</h2>
          <div className="products-grid">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product.productId} className="product-card">
                  <ProductImage src={product.image} alt={product.productName} />
                  <div className="product-info">
                    <h3>{product.productName}</h3>
                    <p className="category-name">
                      {categories.find(c => c.id === product.categoryId)?.name}
                    </p>
                    <p className="price">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(product.price * (1 - product.discount))}
                    </p>
                    {product.discount > 0 && (
                      <p className="discount">
                        Giảm giá: {product.discount * 100}%
                      </p>
                    )}
                    <p className="summary">{product.summary}</p>
                  </div>
                  <div className="product-actions">
                    <button onClick={() => handleEditProduct(product)}>Sửa</button>
                    <button onClick={() => handleGetProductDetail(product.productId)}>Chi tiết</button>
                    {product.status === 'active' ? (
                      <button onClick={() => handleDeactivateProduct(product.productId)}>
                        Ngừng kích hoạt
                      </button>
                    ) : (
                      <button onClick={() => handleActivateProduct(product.productId)}>
                        Kích hoạt
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>Chưa có sản phẩm nào</p>
            )}
          </div>
        </div>
      </div>

      {/* Thông báo */}
      {notification && <div className="notification">{notification}</div>}

      {/* Error boundary */}
      {error && <ErrorFallback error={error} />}

      {showDetailModal && selectedProduct && (
        <div className="modal">
          <div className="modal-content">
            <h2>Chi tiết sản phẩm</h2>
            <div className="product-detail">
              <h3>{selectedProduct.productName}</h3>
              <div className="detail-row">
                <p className="price">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(selectedProduct.price * (1 - selectedProduct.discount))}
                </p>
                {selectedProduct.discount > 0 && (
                  <p className="discount">
                    Giảm giá: {selectedProduct.discount * 100}%
                  </p>
                )}
              </div>
              <div className="detail-info">
                <p><strong>Mô tả:</strong> {selectedProduct.summary}</p>
                <p><strong>Dung tích:</strong> {selectedProduct.capacity}</p>
                <p><strong>Số lượng trong kho:</strong> {selectedProduct.stock}</p>
                <p><strong>Ngày tạo:</strong> {new Date(selectedProduct.createdDate).toLocaleDateString('vi-VN')}</p>
                <p><strong>Trạng thái:</strong> {selectedProduct.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}</p>
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowDetailModal(false)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCategoryManagement;
