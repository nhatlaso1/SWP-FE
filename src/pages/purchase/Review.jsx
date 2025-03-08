import React, { useState } from "react";
import { FaStar, FaCamera, FaVideo } from "react-icons/fa";
import "./Review.css";

export default function Review({ isOpen, onClose, detail }) {
  const [rating, setRating] = useState(0);

  // Hàm xử lý khi nhấn vào sao
  const handleStarClick = (index) => {
    setRating(index + 1);
  };

  // Hàm trả về text mô tả dựa trên số sao
  const getRatingText = (rating) => {
    switch (rating) {
      case 1:
        return "Poor";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Very Good";
      case 5:
        return "Excellent";
      default:
        return "Rate this product";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <h2>Rate Product</h2>

        <div className="product-info">
          <img
            src={
              (detail && detail.productImage) ||
              "https://via.placeholder.com/80"
            }
            alt={detail ? detail.productName : "Product"}
            className="product-img"
          />
          <div>
            <p>
              <strong>
                {detail ? detail.productName : "[READ DESCRIPTION]"}
              </strong>
            </p>
            <span className="product-category">
              {detail && detail.size
                ? `Variant: ${detail.size} x${detail.quantity}`
                : "Variation: N/A"}
            </span>
          </div>
        </div>

        {/* Rating section for product quality */}
        <div className="rating-section">
          <p>Product Quality</p>
          <div className="stars">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                className="star"
                onClick={() => handleStarClick(index)}
                style={{
                  color: index < rating ? "#ffc107" : "#e4e5e9",
                  cursor: "pointer",
                }}
              />
            ))}
            <span className="rate-text">{getRatingText(rating)}</span>
          </div>
        </div>

        {/* Text area for review content */}
        <textarea
          className="review-input"
          placeholder="Please share your thoughts about the product..."
          defaultValue={`Suitable Skin Types:

Functions:

Feedback:`}
        ></textarea>

        {/* Action buttons */}
        <div className="action-buttons">
          <button className="btn cancel" onClick={onClose}>
            Back
          </button>
          <button className="btn submit">Submit</button>
        </div>
      </div>
    </div>
  );
}
