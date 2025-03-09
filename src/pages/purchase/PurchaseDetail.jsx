import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./PurchaseDetail.css";
import { FaFileAlt, FaMoneyCheckAlt, FaTruck, FaBoxOpen } from "react-icons/fa";
import StepItem from "../../components/step/StepItem";
export default function PurchaseDetail() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    const mockData = {
      orderCode: id,
      status: "Complete",

      summaryMessage:
        "Your order has been delivered successfully. Your order is now complete.",
      address: {
        name: "John Doe",
        phone: "0900 000 000",
        addressLine: "123 ABC Street, District 1, HCMC",
        orderDate: "03/10/2025",
        paymentMethod: "Bank Transfer",
      },
      shopName: "BEAUTYSC",
      products: [
        {
          id: 1,
          name: "Product 2",
          variant: "100ml x1",
          oldPrice: 220000,
          newPrice: 200000,
          img: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        },
        {
          id: 1,
          name: "Product 3",
          variant: "1000ml x2",
          oldPrice: 320000,
          newPrice: 300000,
          img: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        },
      ],
      fee: {
        productTotal: 540000,
        shipping: 0,
        discount: 40000,
      },
      note: "",
    };

    // Simulate async call
    setTimeout(() => {
      setOrder(mockData);
    }, 2000);
  }, [id]);

  if (!order) {
    return (
      <div className="loading-container">
        <p className="loading-text">
          Loading order data...
          <img
            src="/loading-quiz-result.svg"
            alt="Loading"
            className="loading-img"
          />
        </p>
      </div>
    );
  }
  const steps = [
    { label: "Order Placed", icon: <FaFileAlt /> },
    { label: "Payment Confirmed", icon: <FaMoneyCheckAlt /> },
    { label: "Handed to Carrier", icon: <FaTruck /> },
    { label: "Order Received", icon: <FaBoxOpen /> },
    { label: "Completed", icon: <FaBoxOpen /> },
  ];
  const doneSteps = 5;
  // Calculate total amount
  const totalAmount =
    (order.fee.productTotal || 0) +
    (order.fee.shipping || 0) -
    (order.fee.discount || 0);

  return (
    <div className="order-detail-container">
      {/* Header Bar */}
      <div className="order-header-bar">
        <button className="back-button" onClick={() => window.history.back()}>
          Back
        </button>
        <div className="order-info">
          <span className="order-code">Order Code: {order.orderCode}</span>
          <span className="order-status-final"> | Order {order.status}</span>
        </div>
      </div>

      {/* Order Steps */}
      <div className="steps-container">
        {steps.map((step, index) => (
          <StepItem
            key={index}
            step={step}
            isDone={index < doneSteps}
            isLast={index === steps.length - 1}
          />
        ))}
      </div>

      {/* Summary */}
      <div className="order-summary-top">
        <p>{order.summaryMessage}</p>
        <div className="order-actions-top">
          <button className="btn-review">Review</button>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="shipping-address">
        <h3>Shipping Address</h3>
        <p>
          {order.address.name} | {order.address.phone}
        </p>
        <p>{order.address.addressLine}</p>
        <div className="address-extra">
          <p>Order Date: {order.address.orderDate}</p>
          <p>Payment Method: {order.address.paymentMethod}</p>
        </div>
      </div>

      {/* Product List */}
      <div className="order-products">
        <div className="shop-header">
          <span className="shop-name">{order.shopName}</span>
        </div>
        {order.products.map((product) => (
          <div className="product-row" key={product.id}>
            <div className="product-info-wrap">
              <img
                src={product.img}
                alt={product.name}
                className="product-img"
              />
              <div className="product-info">
                <h4>{product.name}</h4>
                <p className="product-variant">Variant: {product.variant}</p>
              </div>
            </div>
            <div className="product-price">
              {product.oldPrice && (
                <p className="old-price">
                  ₫{product.oldPrice.toLocaleString()}
                </p>
              )}
              <p className="new-price">₫{product.newPrice.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Summary */}
      <div className="order-payment-summary">
        <div className="order-fee-line">
          <span>Product Total:</span>
          <span>₫{order.fee.productTotal.toLocaleString()}</span>
        </div>
        <div className="order-fee-line">
          <span>Shipping Fee:</span>
          <span>₫{order.fee.shipping.toLocaleString()}</span>
        </div>
        <div className="order-fee-line">
          <span>Discount:</span>
          <span>-₫{order.fee.discount.toLocaleString()}</span>
        </div>
        <div className="order-total">
          <span>Total:</span>
          <strong>₫{totalAmount.toLocaleString()}</strong>
        </div>
        <p className="order-note">{order.note}</p>
      </div>

      {/* Footer Actions */}
      <div className="order-footer-actions">
        <button className="btn-back" onClick={() => window.history.back()}>
          Back
        </button>
        {order.status.toLowerCase() !== "complete" &&
          order.status.toLowerCase() !== "cancel" && (
            <button className="btn-finish">Complete</button>
          )}
      </div>
    </div>
  );
}
