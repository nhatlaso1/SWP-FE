import React, { useState } from 'react';
import './CategoryList.css';

const CategoryList = ({ categories, onEdit, onDelete, onAdd }) => {
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    image: '',
    parentId: null
  });
  const [isAdding, setIsAdding] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showProducts, setShowProducts] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Mock products data (thay thế bằng props sau này)
  const products = [
    {
      id: 1,
      name: "Kem dưỡng ẩm Cerave",
      category: "Kem dưỡng",
      price: 250000,
      stock: 50,
      image: "https://example.com/cerave.jpg",
      description: "Kem dưỡng ẩm phục hồi da",
      ingredients: "Ceramides, Hyaluronic Acid, Niacinamide",
      status: "active"
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(newCategory);
    setNewCategory({ name: '', description: '', image: '', parentId: null });
    setIsAdding(false);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setNewCategory(category);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    onEdit(editingCategory.id, newCategory);
    setEditingCategory(null);
    setNewCategory({ name: '', description: '', image: '', parentId: null });
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setShowProducts(true);
  };

  return (
    <div className="category-management">
      <div className="category-header">
        <h2>Quản lý danh mục sản phẩm</h2>
        <button 
          className="add-btn"
          onClick={() => setIsAdding(true)}
        >
          Thêm danh mục mới
        </button>
      </div>

      {/* Form thêm/sửa danh mục */}
      {(isAdding || editingCategory) && (
        <form className="category-form" onSubmit={editingCategory ? handleUpdate : handleSubmit}>
          <div className="form-group">
            <label>Tên danh mục:</label>
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
              required
              placeholder="VD: Kem dưỡng, Serum, Sữa rửa mặt..."
            />
          </div>

          <div className="form-group">
            <label>Mô tả:</label>
            <textarea
              value={newCategory.description}
              onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
              placeholder="Mô tả chi tiết về danh mục"
            />
          </div>

          <div className="form-group">
            <label>Hình ảnh:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                // Xử lý upload hình ảnh
                console.log('File selected:', e.target.files[0]);
              }}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              {editingCategory ? 'Cập nhật' : 'Thêm mới'}
            </button>
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => {
                setIsAdding(false);
                setEditingCategory(null);
              }}
            >
              Hủy
            </button>
          </div>
        </form>
      )}

      {/* Danh sách danh mục */}
      <div className="categories-grid">
        {categories.map(category => (
          <div key={category.id} className="category-item">
            <div className="category-content" onClick={() => handleCategoryClick(category)}>
              {category.image && (
                <img src={category.image} alt={category.name} className="category-image" />
              )}
              <h3>{category.name}</h3>
              <p>{category.description}</p>
              <span className="product-count">
                {products.filter(p => p.category === category.name).length} sản phẩm
              </span>
            </div>
            
            <div className="category-actions">
              <button 
                className="edit-btn"
                onClick={() => handleEdit(category)}
              >
                Sửa
              </button>
              <button 
                className="delete-btn"
                onClick={() => onDelete(category.id)}
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal hiển thị sản phẩm trong danh mục */}
      {showProducts && selectedCategory && (
        <div className="products-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Sản phẩm trong danh mục: {selectedCategory.name}</h3>
              <button onClick={() => setShowProducts(false)}>✕</button>
            </div>
            <div className="products-list">
              {products
                .filter(p => p.category === selectedCategory.name)
                .map(product => (
                  <div key={product.id} className="product-item">
                    <img src={product.image} alt={product.name} />
                    <div className="product-info">
                      <h4>{product.name}</h4>
                      <p>Giá: {product.price.toLocaleString()}đ</p>
                      <p>Tồn kho: {product.stock}</p>
                      <p className="ingredients">Thành phần: {product.ingredients}</p>
                    </div>
                    <div className="product-actions">
                      <button className="edit-btn">Sửa</button>
                      <button className="delete-btn">Xóa</button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList; 