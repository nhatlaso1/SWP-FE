import React from "react";

import "./ProductCategories.scss";
import { useNavigate } from "react-router-dom";

const ProductCategories: React.FC = () => {
const navigate = useNavigate();
  
    const handleClick = () => {
      navigate("/brands");
    };

  return (
    <div className="product-categories-container">
      <h2 className="title">Products’ Brands</h2>

      <div className="categories-list">
        <div className="category-item" onClick={handleClick}>
          <img src="/products/product-categories-1.png" alt="category-item" />
          <p>Women make up</p>
        </div>
        <div className="category-item" onClick={handleClick}>
          <img src="/products/product-categories-2.png" alt="category-item" />
          <p>Women skincare</p>
        </div>
        <div className="category-item" onClick={handleClick}>
          <img src="/products/product-categories-2.png" alt="category-item" />
          <p>Gifts & sets</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCategories;
