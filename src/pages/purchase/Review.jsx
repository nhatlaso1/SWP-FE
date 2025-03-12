import React, { useState } from "react";
import { FaStar, FaCamera, FaVideo } from "react-icons/fa";
import "./Review.css";
import { createFeedback } from "../../store/feedback.api";
import { useStore } from "../../store";

export default function Review({ isOpen, onClose, detail }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState(
    "Suitable Skin Types:\n\nFunctions:\n\nFeedback:"
  );
  const token = useStore(
    (state) => state.profile.user && state.profile.user.token
  );

  // Handle star click to set rating
  const handleStarClick = (index) => {
    setRating(index + 1);
  };

  // Return descriptive text based on rating
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

  const handleSubmit = async () => {
    if (!token) {
      alert("Please login first!");
      return;
    }
    if (!detail || !detail.productId) {
      alert("Product information is missing!");
      return;
    }
    const feedbackData = {
      rating: rating,
      comment: comment,
      createdDate: new Date().toISOString(),
      status: true,
      productId: detail.productId,
    };

    try {
      // Pass token as second parameter to createFeedback
      await createFeedback(feedbackData, token);
      alert("Thank you for your feedback!");
      // Reset fields and close popup
      setRating(0);
      setComment("Suitable Skin Types:\n\nFunctions:\n\nFeedback:");
      onClose();
    } catch (error) {
      console.error("Error creating feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    }
  };

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

        <textarea
          className="review-input"
          placeholder="Please share your thoughts about the product..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>

        <div className="action-buttons">
          <button className="btn cancel" onClick={onClose}>
            Back
          </button>
          <button className="btn submit" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
