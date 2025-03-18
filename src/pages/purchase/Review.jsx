import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import "./Review.css";
import { createFeedback } from "../../store/feedback.api";
import { useStore } from "../../store";

export default function Review({ isOpen, onClose, detail }) {
  const [rating, setRating] = useState(0.0);
  const [hoverRating, setHoverRating] = useState(0.0); // Trạng thái khi hover
  const [comment, setComment] = useState(
    "Suitable Skin Types:\n\nFunctions:\n\nFeedback:"
  );
  // const token = useStore(
  //   (state) => state.profile.user && state.profile.user.token
  // );
  const token = localStorage.getItem("token");
  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleMouseMove = (event, index) => {
    const rect = event.target.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const percent = offsetX / rect.width;
    const newRating = index + percent + 0.1;
    setHoverRating(parseFloat(newRating.toFixed(1))); // Làm tròn đến 1 chữ số thập phân
  };

  const getRatingText = (rating) => {
    if (rating >= 4.5) return "Excellent";
    if (rating >= 3.5) return "Very Good";
    if (rating >= 2.5) return "Good";
    if (rating >= 1.5) return "Fair";
    if (rating >= 0.5) return "Poor";
    return "Rate this product";
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
      await createFeedback(feedbackData, token);
      alert("Thank you for your feedback!");
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
            {[...Array(5)].map((_, index) => {
              return (
                <FaStar
                  key={index}
                  className="star"
                  onMouseMove={(e) => handleMouseMove(e, index)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => handleStarClick(hoverRating || rating)}
                  style={{
                    color:
                      (hoverRating || rating) > index ? "#ffc107" : "#e4e5e9",
                    cursor: "pointer",
                  }}
                />
              );
            })}
            <span className="rate-text">
              {(hoverRating || rating).toFixed(1)} -{" "}
              {getRatingText(hoverRating || rating)}
            </span>
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
