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
    discount: '',
    quantity: '',
    created_date: new Date().toISOString().split('T')[0],
    is_recommended: false,
    status: 'active',
    brand_id: '',
    category_id: '',
    productImage: null
  });
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageUploadType, setImageUploadType] = useState('file'); // 'file' or 'url'

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

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
    setProductForm(prev => ({
      ...prev,
      productImage: e.target.value
    }));
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
          const discountValue = productForm[key] === '' ? 0 : parseFloat(productForm[key]) / 100;
          formData.append(key, discountValue);
        } else if (key === 'quantity') {
          const quantityValue = productForm[key] === '' ? 0 : parseInt(productForm[key]);
          formData.append(key, quantityValue);
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
        discount: '',
        quantity: '',
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

  const handleEditDetailClick = () => {
    setIsEditing(true);
    setEditedProduct({
      ...selectedProduct,
      brand_id: selectedProduct.brand_id,
      category_id: selectedProduct.category_id
    });
  };

  const handleDetailChange = (field, value) => {
    setEditedProduct(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    try {
      await ProductAPI.update(editedProduct.productId, editedProduct);
      setSelectedProduct(editedProduct);
      setIsEditing(false);
      setHasChanges(false);
      showNotificationMessage('Cập nhật sản phẩm thành công!');
      fetchProducts();
    } catch (error) {
      setError('Không thể cập nhật sản phẩm');
    }
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
                  type="text"
                  value={productForm.quantity}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setProductForm({
                      ...productForm,
                      quantity: value
                    });
                  }}
                  placeholder="Nhập số lượng"
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
                  min="2000-01-01"
                  max="2099-12-31"
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
                  type="text"
                  value={productForm.discount}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d.]/g, '');
                    if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= 100)) {
                      setProductForm({
                        ...productForm,
                        discount: value
                      });
                    }
                  }}
                  placeholder="Nhập % giảm giá (0-100)"
                />
              </div>
              <div className="form-group">
                <label>Hình ảnh:</label>
                <div className="image-upload-options">
                  <div className="upload-type-selector">
                    <label>
                      <input
                        type="radio"
                        value="file"
                        checked={imageUploadType === 'file'}
                        onChange={(e) => setImageUploadType(e.target.value)}
                      />
                      Tải lên từ máy
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="url"
                        checked={imageUploadType === 'url'}
                        onChange={(e) => setImageUploadType(e.target.value)}
                      />
                      Nhập URL
                    </label>
                  </div>

                  {imageUploadType === 'file' ? (
                    <div 
                      className={`drag-drop-zone ${dragActive ? 'active' : ''}`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="upload-label">
                        <div>
                          Kéo thả hình ảnh vào đây hoặc click để chọn file
                          {productForm.productImage && (
                            <div className="selected-file">
                              Đã chọn: {productForm.productImage.name || 'File hình ảnh'}
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                  ) : (
                    <input
                      type="url"
                      placeholder="Nhập URL hình ảnh"
                      value={imageUrl}
                      onChange={handleImageUrlChange}
                      className="url-input"
                    />
                  )}
                </div>
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
                      discount: '',
                      quantity: '',
                      created_date: new Date().toISOString().split('T')[0],
                      is_recommended: false,
                      status: 'active',
                      brand_id: '',
                      category_id: '',
                      productImage: null
                    });
                    setSelectedProduct(null);
                    setImageUrl('');
                    setImageUploadType('file');
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
                {isEditing ? (
                  <>
                    <div className="form-group">
                      <label><strong>Số lượng:</strong></label>
                      <input
                        type="number"
                        value={editedProduct.quantity}
                        onChange={(e) => handleDetailChange('quantity', parseInt(e.target.value) || 0)}
                        min="0"
                      />
                    </div>
                    <div className="form-group">
                      <label><strong>Ngày tạo:</strong></label>
                      <input
                        type="date"
                        value={editedProduct.created_date}
                        onChange={(e) => handleDetailChange('created_date', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label><strong>Thương hiệu:</strong></label>
                      <select
                        value={editedProduct.brand_id}
                        onChange={(e) => handleDetailChange('brand_id', e.target.value)}
                      >
                        {brands.map(brand => (
                          <option key={brand.brandId} value={brand.brandId}>
                            {brand.brandName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label><strong>Danh mục:</strong></label>
                      <select
                        value={editedProduct.category_id}
                        onChange={(e) => handleDetailChange('category_id', e.target.value)}
                      >
                        {categories.map(category => (
                          <option key={category.categoryId} value={category.categoryId}>
                            {category.categoryName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label><strong>Trạng thái:</strong></label>
                      <select
                        value={editedProduct.status}
                        onChange={(e) => handleDetailChange('status', e.target.value)}
                      >
                        <option value="active">Đang kích hoạt</option>
                        <option value="inactive">Huỷ kích hoạt</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <p><strong>Số lượng:</strong> {selectedProduct.quantity}</p>
                    <p><strong>Ngày tạo:</strong> {selectedProduct.created_date}</p>
                    <p><strong>Được đề xuất:</strong> {selectedProduct.is_recommended ? 'Có' : ''}</p>
                    <p><strong>Thương hiệu:</strong> {brands.find(b => b.brandId === selectedProduct.brand_id)?.brandName || selectedProduct.brand_id}</p>
                    <p><strong>Danh mục:</strong> {categories.find(c => c.categoryId === selectedProduct.category_id)?.categoryName || selectedProduct.category_id}</p>
                    <p className="status-line">
                      <strong>Trạng thái:</strong>
                      <span style={{ 
                        color: selectedProduct.status === 'active' ? '#4CAF50' : '#f44336',
                        backgroundColor: selectedProduct.status === 'active' ? '#E8F5E9' : '#FFEBEE',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        marginLeft: '8px'
                      }}>
                        {selectedProduct.status === 'active' ? 'Đang kích hoạt' : 'Huỷ kích hoạt'}
                      </span>
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="modal-actions">
              {isEditing ? (
                <>
                  <button 
                    onClick={handleSaveChanges}
                    disabled={!hasChanges}
                    style={{
                      backgroundColor: hasChanges ? '#4CAF50' : '#ccc',
                      color: 'white',
                      marginRight: '8px'
                    }}
                  >
                    Lưu
                  </button>
                  <button 
                    onClick={() => {
                      setIsEditing(false);
                      setHasChanges(false);
                    }}
                    className="cancel-button"
                  >
                    Huỷ
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={handleEditDetailClick}
                    style={{
                      backgroundColor: '#2196F3',
                      color: 'white',
                      marginRight: '8px'
                    }}
                  >
                    Sửa
                  </button>
                  <button onClick={() => setShowProductDetails(false)} className="cancel-button">
                    Đóng
                  </button>
                </>
              )}
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
                <th>Trạng thái</th>
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
                    <span 
                      style={{ 
                        color: '#4CAF50',
                        backgroundColor: '#E8F5E9',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    >
                      Kích hoạt
                    </span>
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
