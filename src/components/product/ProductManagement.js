import React, { useState, useEffect } from 'react';
import { ProductAPI } from './apiProduct';
import { BrandAPI } from '../Brand/apiBrand';
import { CategoryAPI } from '../category/apiCategory';
import './ProductManagement.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    productId: '',
    productName: '',
    summary: '',
    price: '',
    discount: 0,
    quantity: 0,
    created_date: new Date().toISOString().split('T')[0],
    is_recommended: false,
    status: 'active',
    brand_id: '',
    category_id: '',
    productImage: null
  });
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ProductAPI.getAll(1, 10);
      if (Array.isArray(response)) {
        setProducts(response);
      } else if (response?.$values) {
        setProducts(response.$values);
      } else {
        setProducts([]);
        setError('Dữ liệu không hợp lệ');
      }
    } catch (err) {
      setError('Không thể kết nối đến server. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsResponse, categoriesResponse] = await Promise.all([
          BrandAPI.getAll(),
          CategoryAPI.getAll()
        ]);
        
        // Xử lý dữ liệu brands
        if (Array.isArray(brandsResponse)) {
          setBrands(brandsResponse);
        } else if (brandsResponse?.$values) {
          setBrands(brandsResponse.$values);
        } else {
          setBrands([]);
        }

        // Xử lý dữ liệu categories
        if (Array.isArray(categoriesResponse)) {
          setCategories(categoriesResponse);
        } else if (categoriesResponse?.$values) {
          setCategories(categoriesResponse.$values);
        } else {
          setCategories([]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setBrands([]);
        setCategories([]);
      }
    };
    fetchData();
  }, []);

  const showNotificationMessage = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setProductForm({
      productId: product.productId,
      productName: product.productName,
      summary: product.summary,
      price: product.price,
      discount: product.discount,
      quantity: product.quantity,
      created_date: product.created_date,
      is_recommended: product.is_recommended,
      status: product.status,
      brand_id: product.brand_id,
      category_id: product.category_id,
      productImage: null
    });
    setShowProductForm(true);
  };

  const handleToggleStatus = async (productId, currentStatus) => {
    try {
      if (currentStatus === 'active') {
        await ProductAPI.deactivate(productId);
        showNotificationMessage('Đã hủy kích hoạt sản phẩm thành công!');
      } else {
        await ProductAPI.activate(productId);
        showNotificationMessage('Đã kích hoạt sản phẩm thành công!');
      }
      fetchProducts();
    } catch (err) {
      setError('Không thể thay đổi trạng thái sản phẩm');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductForm(prev => ({
        ...prev,
        productImage: file
      }));
    }
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    if (!productForm.productName.trim() || !productForm.price) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      Object.keys(productForm).forEach(key => {
        if (key === 'productImage' && productForm[key]) {
          formData.append('image', productForm[key]);
        } else if (key === 'discount') {
          formData.append(key, parseFloat(productForm[key]) / 100);
        } else {
          formData.append(key, productForm[key]);
        }
      });

      if (selectedProduct) {
        await ProductAPI.update(selectedProduct.productId, formData);
        showNotificationMessage('Cập nhật sản phẩm thành công!');
      } else {
        await ProductAPI.create(formData);
        showNotificationMessage('Thêm sản phẩm thành công!');
      }

      setShowProductForm(false);
      setProductForm({
        productId: '',
        productName: '',
        summary: '',
        price: '',
        discount: 0,
        quantity: 0,
        created_date: new Date().toISOString().split('T')[0],
        is_recommended: false,
        status: 'active',
        brand_id: '',
        category_id: '',
        productImage: null
      });
      setSelectedProduct(null);
      fetchProducts();
    } catch (err) {
      setError(selectedProduct ? 'Không thể cập nhật sản phẩm' : 'Không thể thêm sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowProductDetails(true);
  };

  return (
    <div className="product-management">
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      <div className="management-header">
        <h1>Quản lý Sản phẩm</h1>
        <div className="header-actions">
          <button onClick={() => { setShowProductForm(true); setSelectedProduct(null); }}>
            Thêm sản phẩm
          </button>
        </div>
      </div>

      {showProductForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
            <form onSubmit={handleSubmitProduct}>
              <div className="form-group">
                <label>Số lượng: <span className="required">*</span></label>
                <input
                  type="number"
                  value={productForm.quantity}
                  onChange={(e) => setProductForm({
                    ...productForm,
                    quantity: parseInt(e.target.value) || 0
                  })}
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label>Ngày tạo:</label>
                <input
                  type="date"
                  value={productForm.created_date}
                  onChange={(e) => setProductForm({
                    ...productForm,
                    created_date: e.target.value
                  })}
                />
              </div>
              <div className="form-group">
                <label>Thương hiệu: <span className="required">*</span></label>
                <select
                  value={productForm.brand_id}
                  onChange={(e) => setProductForm({
                    ...productForm,
                    brand_id: e.target.value
                  })}
                  required
                >
                  <option value="">Chọn thương hiệu</option>
                  {brands.map(brand => (
                    <option key={brand.brandId} value={brand.brandId}>
                      {brand.brandName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Danh mục: <span className="required">*</span></label>
                <select
                  value={productForm.category_id}
                  onChange={(e) => setProductForm({
                    ...productForm,
                    category_id: e.target.value
                  })}
                  required
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map(category => (
                    <option key={category.categoryId} value={category.categoryId}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Mã sản phẩm: <span className="required">*</span></label>
                <input
                  type="text"
                  value={productForm.productId}
                  onChange={(e) => setProductForm({
                    ...productForm,
                    productId: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Tên sản phẩm: <span className="required">*</span></label>
                <input
                  type="text"
                  value={productForm.productName}
                  onChange={(e) => setProductForm({
                    ...productForm,
                    productName: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mô tả:</label>
                <textarea
                  value={productForm.summary}
                  onChange={(e) => setProductForm({
                    ...productForm,
                    summary: e.target.value
                  })}
                />
              </div>
              <div className="form-group">
                <label>Giá: <span className="required">*</span></label>
                <input
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm({
                    ...productForm,
                    price: parseFloat(e.target.value) || 0
                  })}
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label>Giảm giá (%):</label>
                <input
                  type="number"
                  value={productForm.discount * 100}
                  onChange={(e) => setProductForm({
                    ...productForm,
                    discount: (parseFloat(e.target.value) || 0) / 100
                  })}
                  min="0"
                  max="100"
                />
              </div>
              <div className="form-group">
                <label>Hình ảnh:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              <div className="modal-actions">
                <button type="submit">
                  {selectedProduct ? 'Cập nhật' : 'Thêm mới'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowProductForm(false);
                    setProductForm({
                      productId: '',
                      productName: '',
                      summary: '',
                      price: '',
                      discount: 0,
                      quantity: 0,
                      created_date: new Date().toISOString().split('T')[0],
                      is_recommended: false,
                      status: 'active',
                      brand_id: '',
                      category_id: '',
                      productImage: null
                    });
                    setSelectedProduct(null);
                  }}
                  className="cancel-button"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showProductDetails && selectedProduct && (
        <div className="modal">
          <div className="modal-content">
            <h2>Chi tiết sản phẩm</h2>
            <div className="product-detail">
              <div className="detail-info">
                <p><strong>Số lượng:</strong> {selectedProduct.quantity}</p>
                <p><strong>Ngày tạo:</strong> {selectedProduct.created_date}</p>
                <p><strong>Được đề xuất:</strong> {selectedProduct.is_recommended ? 'Có' : ''}</p>
                <p><strong>Thương hiệu:</strong> {brands.find(b => b.brandId === selectedProduct.brand_id)?.brandName || selectedProduct.brand_id}</p>
                <p><strong>Danh mục:</strong> {categories.find(c => c.categoryId === selectedProduct.category_id)?.categoryName || selectedProduct.category_id}</p>
                <p className="status-line">
                  <strong>Trạng thái:</strong>
                  <div className="status-buttons">
                    <button
                      type="button"
                      className={`status-button ${selectedProduct.status === 'active' ? 'active' : ''}`}
                    >
                      Đang kích hoạt
                    </button>
                    <button
                      type="button"
                      className="deactivate-button"
                      onClick={() => handleToggleStatus(selectedProduct.productId, selectedProduct.status)}
                    >
                      Hủy kích hoạt
                    </button>
                  </div>
                </p>
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowProductDetails(false)} className="cancel-button">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">Đang tải dữ liệu...</div>
      ) : (
        <div className="products-table">
          <table>
            <thead>
              <tr>
                <th>Mã sản phẩm</th>
                <th>Tên sản phẩm</th>
                <th>Mô tả</th>
                <th>Giá</th>
                <th>Giảm giá</th>
                <th>Đánh giá</th>
                <th>Hình ảnh</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.productId} onClick={() => handleViewDetails(product)}>
                  <td>{product.productId}</td>
                  <td>{product.productName}</td>
                  <td>{product.summary}</td>
                  <td>
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(product.price)}
                  </td>
                  <td>{(product.discount * 100).toFixed(0)}%</td>
                  <td>{product.rating}</td>
                  <td>
                    {product.productImage && (
                      <img 
                        src={product.productImage} 
                        alt={product.productName}
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={(e) => { e.stopPropagation(); handleEditProduct(product); }}>
                        Sửa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {notification && <div className="notification">{notification}</div>}
    </div>
  );
};

export default ProductManagement;
