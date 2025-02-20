import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product, isAdminView = false, onEdit, onDelete }) => {
  const {
    id,
    name,
    price,
    image,
    category,
    stock,
    description,
    ingredients,
    discount
  } = product;

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={image} alt={name} />
        {discount > 0 && (
          <span className="discount-badge">-{discount}%</span>
        )}
      </div>
      
      <div className="product-info">
        <h3>{name}</h3>
        <p className="category">{category}</p>
        
        <div className="price-section">
          {discount > 0 ? (
            <>
              <span className="original-price">${price}</span>
              <span className="discounted-price">
                ${(price * (1 - discount / 100)).toFixed(2)}
              </span>
            </>
          ) : (
            <span className="price">${price}</span>
          )}
        </div>

        {isAdminView && (
          <div className="admin-section">
            <p className="stock">Còn lại: {stock} sản phẩm</p>
            <div className="admin-actions">
              <button 
                className="edit-btn"
                onClick={() => onEdit(product)}
              >
                Sửa
              </button>
              <button 
                className="delete-btn"
                onClick={() => onDelete(id)}
              >
                Xóa
              </button>
            </div>
          </div>
        )}

        {!isAdminView && (
          <button className="add-to-cart">
            Thêm vào giỏ hàng
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard; 