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
    price: 0,
    quantity: 0,
    discount: 0,
    isRecommended: false,
    brandId: '',
    categoryId: '',
    skinTypes: [],
    ingredients: [],
    functions: [],
    images: []
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async (pageIndex = 1) => {
    setLoading(true);
    setError(null);

    try {
      console.log('Fetching all products...');
      const response = await ProductAPI.getAll(pageIndex, 10);
      console.log('Fetched products response:', response);

      if (Array.isArray(response)) {
        setProducts(response);
        setTotalPages(Math.ceil(response.length / 10));
      } else if (response?.$values) {
        setProducts(response.$values);
        setTotalPages(Math.ceil(response.$values.length / 10));
      } else if (response?.data?.$values) {
        setProducts(response.data.$values);
        setTotalPages(Math.ceil(response.data.$values.length / 10));
      } else {
        console.warn('Unexpected response format:', response);
        setProducts([]);
        setError('Dữ liệu không hợp lệ');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Không thể kết nối đến server. Vui lòng thử lại sau.');
      setProducts([]);
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
      status: product.status,
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
          : []
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
      await fetchProducts();

      setShowCreateForm(false);
      setNewProduct({
        productName: '',
        summary: '',
        size: '',
        price: 0,
        quantity: 0,
        discount: 0,
        isRecommended: false,
        brandId: '',
        categoryId: '',
        skinTypes: [],
        ingredients: [],
        functions: [],
        images: []
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

  const handleNewProductChange = (field, value) => {
    setNewProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchProducts(page); // Gọi lại hàm fetchProducts với trang mới
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
              <input
                type="text"
                value={newProduct.size}
                onChange={(e) => handleNewProductChange('size', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Giá:</label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) => handleNewProductChange('price', e.target.value)}
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Số lượng:</label>
              <input
                type="number"
                value={newProduct.quantity}
                onChange={(e) => handleNewProductChange('quantity', e.target.value)}
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Giảm giá:</label>
              <input
                type="number"
                value={newProduct.discount}
                onChange={(e) => handleNewProductChange('discount', e.target.value)}
                min="0"
                max="1"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label>Đề xuất:</label>
              <input
                type="checkbox"
                checked={newProduct.isRecommended}
                onChange={(e) => handleNewProductChange('isRecommended', e.target.checked)}
              />
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
            <div className="product-detail">
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
                      <input
                        type="text"
                        value={editedProduct.size}
                        onChange={(e) => handleDetailChange('size', e.target.value)}
                      />
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
                      <label><strong>Đề xuất:</strong></label>
                      <input
                        type="checkbox"
                        checked={editedProduct.isRecommended}
                        onChange={(e) => handleDetailChange('isRecommended', e.target.checked)}
                      />
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
                    <p><strong>Số lượng:</strong> {selectedProduct.quantity}</p>
                    <p><strong>Size:</strong> {selectedProduct.size}</p>
                    <p><strong>Giá:</strong> {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(selectedProduct.price)}</p>
                    <p><strong>Giảm giá:</strong> {(selectedProduct.discount * 100).toFixed(0)}%</p>
                    <p><strong>Thương hiệu:</strong> {selectedProduct.brand?.brandName}</p>
                    <p><strong>Danh mục:</strong> {selectedProduct.category?.categoryName}</p>

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
                <th>Số lượng</th>
                <th>Hình ảnh</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.productId}
                  onClick={() => handleViewDetails(product)}
                  style={{ cursor: 'pointer' }}
                  className="product-row"
                >
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
                  <td>{product.quantity}</td>
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
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductManagement;