import React from "react";

import "./ProductCategories.scss";

const ProductCategories = () => {
  return (
    <div className="product-categories-container">
      <h2 className="title">Products’ Categories</h2>

      <div className="categories-list">
        <div className="category-item">
          <img src="/products/product-categories-1.png" alt="category-item" />
          <p>Women make up</p>
        </div>
        <div className="category-item">
          <img src="/products/product-categories-2.png" alt="category-item" />
          <p>Women skincare</p>
        </div>
        <div className="category-item">
          <img src="/products/product-categories-2.png" alt="category-item" />
          <p>Gifts & sets</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCategories;
