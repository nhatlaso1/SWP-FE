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
      // Fetch data for each category ID (assuming we know the category IDs)
      const categoryIds = [1, 2, 3, 4, 5]; // You might want to fetch this list from another API
      const promises = categoryIds.map(id => CategoryCountAPI.getCategoryWithCount(id));
      const results = await Promise.all(promises);
      setCategories(results);
    } catch (err) {
      setError('Cannot connect to the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="category-management">
      <div className="management-header">
        <h1>Category Management</h1>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">Loading data...</div>
      ) : (
        <div className="categories-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Category Name</th>
                <th>Product Count</th>
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
                  <td colSpan="3" style={{ textAlign: 'center' }}>No categories available</td>
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
