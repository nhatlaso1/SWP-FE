import React, { useState, useEffect } from 'react';
import { ProductAPI } from '../../../store/apiProduct';
import { BrandAPI } from '../../../store/apiBrand';
import { CategoryAPI } from '../../../store/apiCategory';
import './ProductManagement.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: 'success' });
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
    size: '',
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
  const [imageUploadType, setImageUploadType] = useState('file');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    productName: '',
    summary: '',
    size: '',
    price: '',
    quantity: '',
    discount: '',
    brandId: '',
    categoryId: '',
    skinTypes: [],
    ingredients: [],
    functions: [],
    images: [],
    status: 'active'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const handlePageChange = async (pageNumber) => {
    setCurrentPage(pageNumber);
    await fetchProducts(pageNumber);
    window.scrollTo(0, 0);
  };

  const fetchProducts = async (pageNumber = 1) => {
    setLoading(true);
    setError(null);

    try {
      console.log('Fetching products for page:', pageNumber);
      const response = await ProductAPI.getAll({
        pageIndex: pageNumber
      });
      console.log('Fetched products response:', response);

      if (response && response.products) {
        setProducts(response.products);
        setTotalItems(response.pagination.totalItems);
        setTotalPages(response.pagination.totalPages);
        setCurrentPage(response.pagination.currentPage);
        
        console.log('Total products loaded:', response.products.length);
        console.log('Total pages:', response.pagination.totalPages);
        console.log('Current page:', response.pagination.currentPage);
        console.log('Total items:', response.pagination.totalItems);
      } else {
        console.error('Invalid response format:', response);
        setProducts([]);
        setTotalItems(0);
        setTotalPages(0);
        setCurrentPage(1);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Không thể kết nối đến server. Vui lòng thử lại sau.');
      setProducts([]);
      setTotalItems(0);
      setTotalPages(0);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsResponse, categoriesResponse] = await Promise.all([
          BrandAPI.getAll(),
          CategoryAPI.getAll()
        ]);


        if (Array.isArray(brandsResponse)) {
          setBrands(brandsResponse);
        } else if (brandsResponse?.$values) {
          setBrands(brandsResponse.$values);
        } else {
          setBrands([]);
        }


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

  const showNotificationMessage = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: 'success' }), 3000);
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
      size: product.size,
      status: product.status || 'active',
      brand_id: product.brand_id,
      category_id: product.category_id,
      productImage: null
    });
    setShowProductForm(true);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(null);
    setShowProductDetails(true);
    fetchProductDetail(product.productId);
  };

  const fetchProductDetail = async (productId) => {
    try {
      const detail = await ProductAPI.getDetail(productId);
      setSelectedProduct(detail);
    } catch (error) {
      setError('Không thể lấy chi tiết sản phẩm');
    }
  };

  const handleEditDetailClick = () => {
    setIsEditing(true);
    setEditedProduct({
      productId: selectedProduct.productId,
      ...selectedProduct,
      brand_id: selectedProduct.brand?.brandId,
      category_id: selectedProduct.category?.categoryId,
      skinTypes: selectedProduct.skinTypes,
      ingredients: selectedProduct.ingredients,
      functions: selectedProduct.functions,
      productImages: selectedProduct.productImages,
      isRecommended: selectedProduct.isRecommended || false
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
      setLoading(true);

      if (!editedProduct.productId) {
        throw new Error('Không tìm thấy ID sản phẩm');
      }


      const price = parseFloat(editedProduct.price);
      const quantity = parseInt(editedProduct.quantity);
      const discount = parseFloat(editedProduct.discount);
      const brandId = parseInt(editedProduct.brand_id);
      const categoryId = parseInt(editedProduct.category_id);

      if (isNaN(price) || price < 0) {
        throw new Error('Giá sản phẩm không hợp lệ');
      }
      if (isNaN(quantity) || quantity < 0) {
        throw new Error('Số lượng sản phẩm không hợp lệ');
      }
      if (isNaN(discount) || discount < 0 || discount > 1) {
        throw new Error('Giảm giá phải từ 0 đến 1');
      }
      if (isNaN(brandId) || brandId <= 0) {
        throw new Error('Vui lòng chọn thương hiệu');
      }
      if (isNaN(categoryId) || categoryId <= 0) {
        throw new Error('Vui lòng chọn danh mục');
      }

      const updateData = {
        productName: editedProduct.productName?.trim() || '',
        size: editedProduct.size?.trim() || '',
        price,
        quantity,
        discount,
        summary: editedProduct.summary?.trim() || '',
        isRecommended: Boolean(editedProduct.isRecommended),
        brandId,
        categoryId,
        skinTypeIds: Array.isArray(editedProduct.skinTypes?.$values)
          ? editedProduct.skinTypes.$values.map(skin => skin.skinTypeId)
          : [],
        ingredientConcentrations: Array.isArray(editedProduct.ingredients?.$values)
          ? editedProduct.ingredients.$values.map(ing => ({
            ingredientId: ing.ingredientId,
            concentration: ing.concentration || 1
          }))
          : [],
        functionIds: Array.isArray(editedProduct.functions?.$values)
          ? editedProduct.functions.$values.map(func => func.functionId)
          : [],
        imageUrls: Array.isArray(editedProduct.productImages?.$values)
          ? editedProduct.productImages.$values.map(img => img.productImage)
          : [],
        status: editedProduct.status
      };

      console.log('Updating product with ID:', editedProduct.productId);
      console.log('Update data:', updateData);

      await ProductAPI.update(editedProduct.productId, updateData);
      await fetchProducts(); // Refresh the product list
      await fetchProductDetail(editedProduct.productId);
      setIsEditing(false);
      setHasChanges(false);
      showNotificationMessage('Cập nhật sản phẩm thành công!', 'success');
    } catch (error) {
      console.error('Error in handleSaveChanges:', error);
      showNotificationMessage(error.message || 'Không thể cập nhật sản phẩm. Vui lòng thử lại!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      if (!newProduct.productName?.trim()) {
        throw new Error('Vui lòng nhập tên sản phẩm');
      }

      // Validate numeric fields
      const price = parseFloat(newProduct.price);
      const quantity = parseInt(newProduct.quantity);
      const discount = parseFloat(newProduct.discount);
      const brandId = parseInt(newProduct.brandId);
      const categoryId = parseInt(newProduct.categoryId);

      if (isNaN(price) || price < 0) {
        throw new Error('Giá sản phẩm không hợp lệ');
      }
      if (isNaN(quantity) || quantity < 0) {
        throw new Error('Số lượng sản phẩm không hợp lệ');
      }
      if (isNaN(discount) || discount < 0 || discount > 1) {
        throw new Error('Giảm giá phải từ 0 đến 1');
      }
      if (isNaN(brandId) || brandId <= 0) {
        throw new Error('Vui lòng chọn thương hiệu');
      }
      if (isNaN(categoryId) || categoryId <= 0) {
        throw new Error('Vui lòng chọn danh mục');
      }

      const productToCreate = {
        productName: newProduct.productName || 'Sản phẩm mới',
        summary: newProduct.summary || 'Mô tả sản phẩm',
        size: newProduct.size || 'M',
        price: parseFloat(newProduct.price) || 100,
        quantity: parseInt(newProduct.quantity) || 10,
        discount: parseFloat(newProduct.discount) || 0.1,
        isRecommended: newProduct.isRecommended,
        brandId: parseInt(newProduct.brandId) || 1,
        categoryId: parseInt(newProduct.categoryId) || 1,
        skinTypes: newProduct.skinTypes,
        ingredients: newProduct.ingredients,
        functions: newProduct.functions,
        images: newProduct.images
      };

      console.log('Attempting to create product with data:', productToCreate);

      const createResponse = await ProductAPI.create(productToCreate);
      console.log('Create product response:', createResponse);

      if (!createResponse) {
        throw new Error('Không nhận được phản hồi khi tạo sản phẩm');
      }

      // Đợi một chút trước khi làm mới danh sách
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Refreshing product list...');
      // Lấy danh sách sản phẩm mới và tính toán trang cuối
      const response = await ProductAPI.getAll({ pageIndex: 1 });
      const lastPage = Math.ceil(response.pagination.totalItems / itemsPerPage);
      
      // Chuyển đến trang cuối cùng để hiển thị sản phẩm mới
      await fetchProducts(lastPage);
      setCurrentPage(lastPage);

      setShowCreateForm(false);
      setNewProduct({
        productName: '',
        summary: '',
        size: '',
        price: '',
        quantity: '',
        discount: '',
        brandId: '',
        categoryId: '',
        skinTypes: [],
        ingredients: [],
        functions: [],
        images: [],
        status: 'active'
      });
      showNotificationMessage('Tạo sản phẩm thành công!', 'success');
    } catch (error) {
      console.error('Error in handleCreateProduct:', error);
      const errorMessage = error.response?.data?.detail
        || error.response?.data?.message
        || error.message
        || 'Không thể tạo sản phẩm. Vui lòng thử lại!';

      showNotificationMessage(errorMessage, 'error');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleActivateProduct = async (productId) => {
    try {
      await ProductAPI.activate(productId);
      showNotificationMessage('Kích hoạt sản phẩm thành công!', 'success');
      await fetchProducts(); // Refresh the product list
    } catch (error) {
      showNotificationMessage(error.message || 'Không thể kích hoạt sản phẩm', 'error');
    }
  };

  const handleDeactivateProduct = async (productId) => {
    try {
      await ProductAPI.deactivate(productId);
      showNotificationMessage('Ngừng kích hoạt sản phẩm thành công!', 'success');
      await fetchProducts(); // Refresh the product list
    } catch (error) {
      showNotificationMessage(error.message || 'Không thể ngừng kích hoạt sản phẩm', 'error');
    }
  };

  const handleNewProductChange = (field, value) => {
    setNewProduct(prev => ({
      ...prev,
      [field]: value
    }));
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
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleImageFile = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target.result);
        handleNewProductChange('images', [e.target.result]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="product-management">
      <div className="header-actions" style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setShowCreateForm(true)}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Thêm sản phẩm mới
        </button>
      </div>

      {showCreateForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>Thêm sản phẩm mới</h2>
            <div className="form-group">
              <label>Tên sản phẩm:</label>
              <input
                type="text"
                value={newProduct.productName}
                onChange={(e) => handleNewProductChange('productName', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Mô tả:</label>
              <textarea
                value={newProduct.summary}
                onChange={(e) => handleNewProductChange('summary', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Size:</label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="number"
                  value={newProduct.size.replace('ml', '')}
                  onChange={(e) => handleNewProductChange('size', `${e.target.value}ml`)}
                  min="0"
                  style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                />
                <span style={{ marginLeft: '8px', fontSize: '16px' }}>ml</span>
              </div>
            </div>
            <div className="form-group">
              <label>Giá:</label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => handleNewProductChange('price', e.target.value)}
                  min="0"
                  style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                  placeholder="Nhập giá sản phẩm"
                />
                <span style={{ marginLeft: '8px', fontSize: '16px' }}>đ</span>
              </div>
            </div>
            <div className="form-group">
              <label>Số lượng:</label>
              <input
                type="number"
                value={newProduct.quantity}
                onChange={(e) => handleNewProductChange('quantity', e.target.value)}
                min="0"
                style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                placeholder="Nhập số lượng"
              />
            </div>
            <div className="form-group">
              <label>Giảm giá:</label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="number"
                  value={newProduct.discount ? (newProduct.discount * 100) : ''}
                  onChange={(e) => handleNewProductChange('discount', parseFloat(e.target.value) / 100)}
                  min="0"
                  max="100"
                  style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                  placeholder="Nhập % giảm giá"
                />
                <span style={{ marginLeft: '8px', fontSize: '16px' }}>%</span>
              </div>
            </div>
            <div className="form-group">
              <label>Thương hiệu:</label>
              <select
                value={newProduct.brandId}
                onChange={(e) => handleNewProductChange('brandId', e.target.value)}
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
              <label>Danh mục:</label>
              <select
                value={newProduct.categoryId}
                onChange={(e) => handleNewProductChange('categoryId', e.target.value)}
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
              <label>Hình ảnh sản phẩm:</label>
              <div style={{ marginTop: '8px' }}>
                <input
                  type="text"
                  placeholder="Nhập URL hình ảnh"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    handleNewProductChange('images', [e.target.value]);
                  }}
                  style={{ width: '100%', padding: '8px' }}
                />

                {imageUrl && (
                  <div style={{ marginTop: '10px', textAlign: 'center' }}>
                    <img
                      src={imageUrl}
                      alt="Preview"
                      style={{
                        maxWidth: '200px',
                        maxHeight: '200px',
                        objectFit: 'contain'
                      }}
                    />
                    <button
                      onClick={() => {
                        setImageUrl('');
                        handleNewProductChange('images', []);
                      }}
                      style={{
                        display: 'block',
                        margin: '10px auto',
                        padding: '5px 10px',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Xóa ảnh
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-actions">
              <button
                onClick={handleCreateProduct}
                style={{
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  marginRight: '8px'
                }}
              >
                Tạo
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="cancel-button"
              >
                Huỷ
              </button>
            </div>
          </div>
        </div>
      )}

      {showProductDetails && selectedProduct && (
        <div className="modal">
          <div className="modal-content">
            <h2>Chi tiết sản phẩm</h2>
            <div className="product-detail" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div className="detail-info">
                {isEditing ? (
                  <>
                    <div className="form-group">
                      <label><strong>Tên sản phẩm:</strong></label>
                      <input
                        type="text"
                        value={editedProduct.productName}
                        onChange={(e) => handleDetailChange('productName', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label><strong>Mô tả:</strong></label>
                      <textarea
                        value={editedProduct.summary}
                        onChange={(e) => handleDetailChange('summary', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label><strong>Size:</strong></label>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                          type="number"
                          value={editedProduct.size.replace('ml', '')}
                          onChange={(e) => handleDetailChange('size', `${e.target.value}ml`)}
                          min="0"
                        />
                        <span style={{ marginLeft: '8px', fontSize: '16px' }}>ml</span>
                      </div>
                    </div>
                    <div className="form-group">
                      <label><strong>Giá:</strong></label>
                      <input
                        type="number"
                        value={editedProduct.price}
                        onChange={(e) => handleDetailChange('price', parseFloat(e.target.value) || 0)}
                        min="0"
                      />
                    </div>
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
                      <label><strong>Giảm giá:</strong></label>
                      <input
                        type="number"
                        value={editedProduct.discount}
                        onChange={(e) => handleDetailChange('discount', parseFloat(e.target.value) || 0)}
                        min="0"
                        max="1"
                        step="0.01"
                      />
                    </div>
                    <div className="form-group">
                      <label><strong>Trạng thái:</strong></label>
                      <select
                        value={editedProduct.status}
                        onChange={(e) => handleDetailChange('status', e.target.value)}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label><strong>Thương hiệu:</strong></label>
                      <select
                        value={editedProduct.brand_id}
                        onChange={(e) => handleDetailChange('brand_id', parseInt(e.target.value))}
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
                        onChange={(e) => handleDetailChange('category_id', parseInt(e.target.value))}
                      >
                        {categories.map(category => (
                          <option key={category.categoryId} value={category.categoryId}>
                            {category.categoryName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="detail-row">
                      <p><strong>Tên sản phẩm:</strong> {selectedProduct.productName}</p>
                      <p><strong>Giá:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedProduct.price)}</p>
                    </div>
                    <div className="detail-row">
                      <p><strong>Mô tả:</strong> {selectedProduct.summary}</p>
                      <p><strong>Giảm giá:</strong> {(selectedProduct.discount * 100).toFixed(0)}%</p>
                    </div>
                    <div className="detail-row">
                      <p><strong>Size:</strong> {selectedProduct.size}ml</p>
                      <p><strong>Số lượng:</strong> {selectedProduct.quantity}</p>
                    </div>
                    <div className="detail-row">
                      <p><strong>Thương hiệu:</strong> {selectedProduct.brand?.brandName}</p>
                      <p><strong>Danh mục:</strong> {selectedProduct.category?.categoryName}</p>
                    </div>
                    <div className="detail-section">
                      <h3>Loại da phù hợp:</h3>
                      <ul>
                        {selectedProduct.skinTypes?.$values.map(skin => (
                          <li key={skin.skinTypeId}>{skin.skinTypeName}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="detail-section">
                      <h3>Công dụng:</h3>
                      <ul>
                        {selectedProduct.functions?.$values.map(func => (
                          <li key={func.functionId}>{func.functionName}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="detail-section">
                      <h3>Thành phần:</h3>
                      <ul>
                        {selectedProduct.ingredients?.$values.map(ingredient => (
                          <li key={ingredient.ingredientId}>{ingredient.ingredientName}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="detail-section">
                      <h3>Đánh giá từ khách hàng:</h3>
                      {selectedProduct.feedbacks?.$values.map(feedback => (
                        <div key={feedback.feedbackId} className="feedback-item">
                          <p><strong>Đánh giá:</strong> {feedback.rating}/5</p>
                          <p><strong>Nhận xét:</strong> {feedback.comment}</p>
                          <p><strong>Ngày:</strong> {new Date(feedback.createdDate).toLocaleDateString('vi-VN')}</p>
                        </div>
                      ))}
                    </div>
                    <div className="detail-section">
                      <h3>Hình ảnh sản phẩm:</h3>
                      <div className="product-images">
                        {selectedProduct.productImages?.$values.map(image => (
                          <img
                            key={image.productImageId}
                            src={image.productImage}
                            alt={selectedProduct.productName}
                            style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '5px' }}
                          />
                        ))}
                      </div>
                    </div>
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
      ) : error ? (
        <div className="error-message" style={{ color: 'red', textAlign: 'center' }}>
          {error}
        </div>
      ) : (
        <>
          <div className="products-table">
            <table>
              <thead>
                <tr>
                  <th className="col-id">Mã sản phẩm</th>
                  <th className="col-name">Tên sản phẩm</th>
                  <th className="col-price">Giá</th>
                  <th className="col-discount">Giảm giá</th>
                  <th className="col-quantity">Số lượng</th>
                  <th className="col-image">Hình ảnh</th>
                  <th className="col-status">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.productId}
                    onClick={() => handleViewDetails(product)}
                    className="product-row"
                  >
                    <td className="col-id">{product.productId}</td>
                    <td className="col-name text-ellipsis">{product.productName}</td>
                    <td className="col-price">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(product.price)}
                    </td>
                    <td className="col-discount">{(product.discount * 100).toFixed(0)}%</td>
                    <td className="col-quantity">{product.quantity}</td>
                    <td className="col-image">
                      {product.productImage && (
                        <img
                          src={product.productImage}
                          alt={product.productName}
                          className="product-image"
                        />
                      )}
                    </td>
                    <td className="col-status">
                      <span className={`status-badge ${product.status === 'active' ? 'active' : 'inactive'}`}>
                        {product.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination" style={{ 
              marginTop: '20px', 
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px'
            }}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 12px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  backgroundColor: 'transparent',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  color: currentPage === 1 ? '#ccc' : '#333'
                }}
              >
                &lt;
              </button>

              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;
                // Hiển thị các nút trang xung quanh trang hiện tại
                if (
                  pageNumber === 1 || // Luôn hiển thị trang đầu
                  pageNumber === totalPages || // Luôn hiển thị trang cuối
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1) // Hiển thị 1 trang trước và sau trang hiện tại
                ) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: currentPage === pageNumber ? '#4CAF50' : 'white',
                        color: currentPage === pageNumber ? 'white' : '#333',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        minWidth: '40px'
                      }}
                    >
                      {pageNumber}
                    </button>
                  );
                } else if (
                  pageNumber === currentPage - 2 ||
                  pageNumber === currentPage + 2
                ) {
                  // Hiển thị dấu ... cho các trang bị ẩn
                  return (
                    <span
                      key={pageNumber}
                      style={{
                        padding: '8px',
                        color: '#666'
                      }}
                    >
                      ...
                    </span>
                  );
                }
                return null;
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  padding: '8px 12px',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  backgroundColor: 'transparent',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  color: currentPage === totalPages ? '#ccc' : '#333'
                }}
              >
                &gt;
              </button>
            </div>
          )}
        </>
      )}

      {notification.message && (
        <div
          className="notification"
          style={{
            backgroundColor: notification.type === 'success' ? '#4CAF50' : '#f44336',
            color: 'white',
            padding: '16px',
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            borderRadius: '4px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            zIndex: 1000
          }}
        >
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default ProductManagement;