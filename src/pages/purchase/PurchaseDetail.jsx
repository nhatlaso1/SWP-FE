import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaFileAlt,
  FaMoneyCheckAlt,
  FaTruck,
  FaBoxOpen,
  FaUndo,
  FaTimesCircle,
} from "react-icons/fa";
import StepItem from "../../components/step/StepItem";
import "./PurchaseDetail.css";
import { getPurchaseDetail } from "../../store/purchase.api";
import { useStore } from "../../store";

function getDoneSteps(status) {
  const s = status.toLowerCase();
  switch (s) {
    case "pending":
      return 1;
    case "confirmed":
      return 2;
    case "shipping":
      return 3;
    case "complete":
      return 5;
    case "returned":
      return 4;
    case "cancel":
    case "denied":
      return 0;
    default:
      return 0;
  }
}

export default function PurchaseDetail() {
  const { id } = useParams();
  const token = useStore((state) => state.profile.user?.token);

  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!id || !token) return;
    async function fetchOrder() {
      try {
        const data = await getPurchaseDetail(id, token);
        console.log(data);
        setOrder(data);
      } catch (error) {
        console.error("Error fetching purchase detail:", error);
      }
    }
    fetchOrder();
  }, [id, token]);

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

  const items = order.details?.$values || [];
  const totalProductPrice = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shopDiscount = items.reduce(
    (acc, item) => acc + item.price * item.discount * item.quantity,
    0
  );
  const shippingFee = order.shippingPrice || 0;
  const voucherDiscount = order.voucher.discountAmount || 0;
  const totalPayment =
    totalProductPrice + shippingFee - shopDiscount - voucherDiscount;

  const steps = [
    { label: "Order Placed", icon: <FaFileAlt /> },
    { label: "Payment Confirmed", icon: <FaMoneyCheckAlt /> },
    { label: "Handed to Carrier", icon: <FaTruck /> },
    { label: "Order Received", icon: <FaBoxOpen /> },
    { label: "Completed", icon: <FaBoxOpen /> },
  ];
  const doneSteps = getDoneSteps(order.status);

  return (
    <div className="order-detail-container">
      <div className="order-header-bar">
        <button className="back-button" onClick={() => window.history.back()}>
          &lt; Back
        </button>
        <div className="order-info">
          <span className="order-code">Order Code: {order.orderCode}</span>
          <span className="order-status-final">| Status: {order.status}</span>
        </div>
      </div>

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
      <p className={`order-message ${order.status.toLowerCase()}`}>
        {order.status.toLowerCase() === "complete" &&
          "Your order is completed. Thank you for shopping with us!"}
        {order.status.toLowerCase() === "confirmed" &&
          "Your order has been confirmed and is being prepared for shipping."}
        {order.status.toLowerCase() === "pending" &&
          "Your order is pending and awaiting confirmation."}
        {order.status.toLowerCase() === "shipping" &&
          "Your order is on the way."}
        {order.status.toLowerCase() === "returned" &&
          "Your order has been returned."}
        {order.status.toLowerCase() === "cancel" &&
          "Your order has been canceled."}
        {order.status.toLowerCase() === "denied" &&
          "Your order has been denied."}
      </p>
      {order.paymentMethodName === "Payment when delivered (COD)" && (
        <p className="order-message cod-message">
          Please pay <strong>₫{order.totalAmount.toLocaleString()}</strong> upon
          delivery.
        </p>
      )}
      <div className="customer-info">
        <h3>🛍️ Customer Information</h3>
        <p>
          <strong>👤 Name:</strong> {order.fullName}
        </p>
        <p>
          <strong>📞 Phone:</strong> {order.phoneNumber}
        </p>
        <p>
          <strong>📍 Address:</strong> {order.address}
        </p>
        <p>
          <strong>🕒 Order Date:</strong>{" "}
          {new Date(order.createdDate).toLocaleDateString()}
        </p>
        <p>
          <strong>💳 Payment Method:</strong> {order.paymentMethodName}
        </p>
      </div>

      <div className="order-products">
        <h3>Order Items</h3>
        {items.map((item) => (
          <div
            className="product-row"
            key={item.orderDetailId}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            {/* Bên trái: Hình + 4 dòng (Name, Category, Skin Types, Quantity) */}
            <div
              className="product-info-wrap"
              style={{ display: "flex", flex: 1, alignItems: "flex-start" }}
            >
              <img
                src={item.productImage || "https://via.placeholder.com/100"}
                alt={item.productName}
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  marginRight: "8px",
                  borderRadius: "4px",
                }}
              />
              <div className="product-info" style={{ flexGrow: 1 }}>
                {/* Dòng 1: Tên sản phẩm */}
                
                <h4
                  style={{
                    margin: 0,
                    fontSize: "16px",
                    color: "#333",
                    marginBottom: "4px",
                  }}
                >
                  {item.productName}
                </h4>

                {/* Dòng 2: Category */}
                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    color: "#d9534f",
                    marginBottom: "4px",
                  }}
                >
                  <strong>Category:</strong>{" "}
                  {item.category?.categoryName || "N/A"}
                </p>

                {/* Dòng 3: Skin Types */}
                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    color: "#5cb85c",
                    marginBottom: "4px",
                  }}
                >
                  <strong>Skin Types:</strong>{" "}
                  {Array.isArray(item.skinTypes?.$values) &&
                  item.skinTypes.$values.length > 0
                    ? item.skinTypes.$values
                        .map((st) => st.skinTypeName)
                        .join(", ")
                    : "N/A"}
                </p>
                  
                {/* Dòng 4: Quantity */}
                <p style={{ margin: 0, fontSize: "14px" }}>
                  <strong>Quantity:</strong> {item.quantity}
                </p>

              </div>
            </div>

            {/* Bên phải: Giá cũ (nếu discount > 0) + Giá mới */}
            <div
              className="product-price"
              style={{ textAlign: "right", minWidth: "100px" }}
            >
              {item.discount > 0 && (
                <p
                  className="old-price"
                  style={{
                    textDecoration: "line-through",
                    color: "#999",
                    margin: "0 0 4px 0",
                  }}
                >
                  ₫{(item.price * item.quantity).toLocaleString()}
                </p>
              )}
              <p
                className="new-price"
                style={{
                  color: "#e84343",
                  fontWeight: "bold",
                  margin: 0,
                }}
              >
                ₫
                {(
                  item.price *
                  (1 - item.discount) *
                  item.quantity
                ).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="order-payment-summary">
        <h3>Payment Summary</h3>
        <div className="order-fee-line">
          <span className="label">Subtotal:</span>{" "}
          <span className="value">₫{totalProductPrice.toLocaleString()}</span>
        </div>
        <div className="order-fee-line">
          <span className="label">Shipping Fee:</span>{" "}
          <span className="value">₫{shippingFee.toLocaleString()}</span>
        </div>
        <div className="order-fee-line">
          <span className="label">Product Discount:</span>{" "}
          <span className="value">-₫{shopDiscount.toLocaleString()}</span>
        </div>
        <div className="order-fee-line">
          <span className="label">Voucher Discount:</span>{" "}
          <span className="value">
            -₫{voucherDiscount ? voucherDiscount.toLocaleString() : "0"}
          </span>
        </div>

        <div className="order-total">
          <span className="label">Total Payment:</span>{" "}
          <span className="value">₫{totalPayment.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
