import React, { useState, useEffect } from 'react';
import { CategoryAPI } from './apiCategory';
import { ProductAPI } from '../product/apiProduct';
import './CategoryManagement.css';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    categoryName: '',
    description: ''
  });
  const [productCounts, setProductCounts] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await CategoryAPI.getAll();
      let categoriesData = [];
      if (Array.isArray(response)) {
        categoriesData = response;
      } else if (response?.$values) {
        categoriesData = response.$values;
      }
      setCategories(categoriesData);
      
      // Lấy số lượng sản phẩm cho mỗi danh mục
      const counts = {};
      for (const category of categoriesData) {
        const count = await ProductAPI.getCountByCategory(category.categoryId);
        counts[category.categoryId] = count;
      }
      setProductCounts(counts);
    } catch (err) {
      setError('Không thể kết nối đến server. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const showNotificationMessage = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setCategoryForm({
      categoryName: category.categoryName,
      description: category.description
    });
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      try {
        await CategoryAPI.delete(categoryId);
        showNotificationMessage('Xóa danh mục thành công!');
        fetchCategories();
      } catch (err) {
        setError('Không thể xóa danh mục');
      }
    }
  };

  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.categoryName.trim()) {
      setError('Tên danh mục không được để trống');
      return;
    }

    try {
      setLoading(true);
      if (selectedCategory) {
        await CategoryAPI.update(selectedCategory.categoryId, categoryForm);
        showNotificationMessage('Cập nhật danh mục thành công!');
      } else {
        await CategoryAPI.create(categoryForm);
        showNotificationMessage('Thêm danh mục thành công!');
      }
      setShowCategoryForm(false);
      setCategoryForm({ categoryName: '', description: '' });
      setSelectedCategory(null);
      fetchCategories(); // Refresh danh sách
    } catch (err) {
      setError(selectedCategory ? 'Không thể cập nhật danh mục' : 'Không thể thêm danh mục');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="category-management">
      <div className="management-header">
        <h1>Quản lý Danh mục</h1>
        <div className="header-actions">
          <button onClick={() => { setShowCategoryForm(true); setSelectedCategory(null); }}>
            Thêm danh mục
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {showCategoryForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedCategory ? 'Sửa danh mục' : 'Thêm danh mục mới'}</h2>
            <form onSubmit={handleSubmitCategory}>
              <div className="form-group">
                <label>Tên danh mục: <span className="required">*</span></label>
                <input
                  type="text"
                  value={categoryForm.categoryName}
                  onChange={(e) => setCategoryForm({
                    ...categoryForm,
                    categoryName: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mô tả:</label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({
                    ...categoryForm,
                    description: e.target.value
                  })}
                />
              </div>
              <div className="modal-actions">
                <button type="submit">
                  {selectedCategory ? 'Cập nhật' : 'Thêm mới'}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowCategoryForm(false);
                    setCategoryForm({ categoryName: '', description: '' });
                    setSelectedCategory(null);
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

      {loading ? (
        <div className="loading-spinner">Đang tải dữ liệu...</div>
      ) : (
        <div className="categories-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên danh mục</th>
                <th>Mô tả</th>
                <th>Số lượng sản phẩm</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.categoryId}>
                  <td>{category.categoryId}</td>
                  <td>{category.categoryName}</td>
                  <td>{category.description}</td>
                  <td>{productCounts[category.categoryId] || 0} sản phẩm</td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => handleEditCategory(category)}>Sửa</button>
                      <button 
                        onClick={() => handleDeleteCategory(category.categoryId)}
                        className="delete-button"
                      >
                        Xóa
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

export default CategoryManagement;
