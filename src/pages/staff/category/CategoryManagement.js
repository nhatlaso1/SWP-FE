import React, { useState, useEffect } from 'react';
import { CategoryCountAPI } from '../../../store/apiCountCategory';
import './CategoryManagement.css';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const categoriesWithCount = await CategoryCountAPI.getCategoriesWithCount();
      setCategories(categoriesWithCount);
    } catch (err) {
      setError('Không thể kết nối đến server. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="category-management">
      <div className="management-header">
        <h1>Quản lý Danh mục</h1>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>✕</button>
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
                <th>Số lượng sản phẩm</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category.categoryId}>
                    <td>{category.categoryId}</td>
                    <td>{category.categoryName}</td>
                    <td>{category.productCount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>Không có danh mục nào</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
