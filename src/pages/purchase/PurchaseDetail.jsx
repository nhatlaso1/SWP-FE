import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaFileAlt, FaMoneyCheckAlt, FaTruck, FaBoxOpen } from "react-icons/fa";
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

  // Mảng chi tiết sản phẩm
  const items = order.details?.$values || [];

  // Tính “tổng tiền hàng” (chưa áp discount)
  const totalProductPrice = items.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  // Tính tổng discount
  const shopDiscount = items.reduce((acc, item) => {
    // tiền giảm cho mỗi sản phẩm = item.price * discount * quantity
    return acc + item.price * item.discount * item.quantity;
  }, 0);

  // Giả sử phí vận chuyển, voucher
  const shippingFee = 30000;
  const voucher = 10000;

  // Tổng thanh toán cuối
  const totalPayment = totalProductPrice + shippingFee - shopDiscount - voucher;

  // Các bước hiển thị trạng thái đơn hàng
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
      {/* Header Bar */}
      <div className="order-header-bar">
        <button className="back-button" onClick={() => window.history.back()}>
          &lt; Trở Lại
        </button>
        <div className="order-info">
          <span className="order-code">Mã đơn hàng: {order.orderCode}</span>
          <span className="order-status-final">| Order {order.status}</span>
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

      {/* Thông báo trạng thái / heading */}
      {order.status.toLowerCase() === "complete" && (
        <div className="order-completed-msg">
          <p>Đơn hàng đã hoàn thành. Cảm ơn bạn đã mua sắm!</p>
          <p>
            Ngày hoàn thành: {new Date(order.createdDate).toLocaleDateString()}
          </p>
        </div>
      )}
      {order.status.toLowerCase() === "confirmed" && (
        <div className="order-completed-msg">
          <p>Đơn hàng đã được xác nhận, đang chuẩn bị giao.</p>
        </div>
      )}
      {order.status.toLowerCase() === "shipping" && (
        <div className="order-completed-msg">
          <p>Đơn hàng đang bị giao.</p>
        </div>
      )}

      {/* Customer Information */}
      <div className="customer-info">
        <h3>Customer Information</h3>
        <p>
          <strong>Name:</strong> {order.fullName}
        </p>
        <p>
          <strong>Phone:</strong> {order.phoneNumber}
        </p>
        <p>
          <strong>Address:</strong> {order.address}
        </p>
        <p>
          <strong>Order Date:</strong>{" "}
          {new Date(order.createdDate).toLocaleDateString()}
        </p>
      </div>

      {/* Order Details */}
      <div className="order-products">
        <h3>Sản phẩm trong đơn hàng</h3>
        {items.map((item) => {
          const originalPrice = item.price * item.quantity;
          const discountedPrice = item.price * (1 - item.discount);
          const finalPrice = discountedPrice * item.quantity;

          return (
            <div className="product-row" key={item.orderDetailId}>
              <div className="product-info-wrap">
                <img
                  src={item.productImage || "https://via.placeholder.com/100"}
                  alt={item.productName}
                  className="product-img"
                />
                <div className="product-info">
                  <h4>{item.productName}</h4>
                  <p className="product-variant">
                    {item.size} x {item.quantity}
                  </p>
                </div>
              </div>
              <div className="product-price">
                {/* Giá gốc (nếu discount > 0) */}
                {item.discount > 0 && (
                  <p className="old-price">₫{originalPrice.toLocaleString()}</p>
                )}
                {/* Giá đã giảm */}
                <p className="new-price">₫{finalPrice.toLocaleString()}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Summary */}
      <div className="order-payment-summary">
        <h3>Payment Summary</h3>
        <div className="order-fee-line">
          <span className="label">Tổng tiền hàng:</span>
          <span className="value">₫{totalProductPrice.toLocaleString()}</span>
        </div>
        <div className="order-fee-line">
          <span className="label">Phí vận chuyển:</span>
          <span className="value">₫{shippingFee.toLocaleString()}</span>
        </div>
        <div className="order-fee-line">
          <span className="label">Giảm giá SP:</span>
          <span className="value">-₫{shopDiscount.toLocaleString()}</span>
        </div>
        <div className="order-fee-line">
          <span className="label">Voucher:</span>
          <span className="value">-₫{voucher.toLocaleString()}</span>
        </div>
        <div className="order-total">
          <span className="label">Tổng thanh toán:</span>
          <span className="value">₫{totalPayment.toLocaleString()}</span>
        </div>
        <p className="order-note">
          Vui lòng thanh toán <strong>₫{totalPayment.toLocaleString()}</strong>{" "}
          khi nhận hàng
        </p>
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
