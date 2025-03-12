import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Pagination, TextField, MenuItem } from "@mui/material";
import { useStore } from "../../store";
import { getAllUserOrders } from "../../store/purchase.api";
import Review from "./Review";
import "./Purchase.css";

export default function Purchase() {
  const navigate = useNavigate();
  const token = useStore((state) => state.profile.user?.token);
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedReviewDetail, setSelectedReviewDetail] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(10);

  const statusTabs = [
    { key: "", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "confirmed", label: "Confirmed" },
    { key: "shipping", label: "Shipping" },
    { key: "complete", label: "Complete" },
    { key: "returned", label: "Returned" },
    { key: "cancel", label: "Cancel" },
    { key: "denied", label: "Denied" },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      try {
        const data = await getAllUserOrders(selectedStatus, token);
        console.log("Raw orders from API:", data);
        // Nếu dữ liệu được bọc trong $values, lấy mảng orders từ đó
        const ordersArray = data.$values ? data.$values : data;
        // Sắp xếp đơn hàng theo createdDate (mới nhất lên đầu)
        const sortedData = ordersArray.sort(
          (a, b) =>
            new Date(b.createdDate || 0).getTime() -
            new Date(a.createdDate || 0).getTime()
        );
        console.log("Sorted orders:", sortedData);
        setOrders(sortedData);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [token, selectedStatus]);

  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const currentOrders = orders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const handleStatusTab = (status) => {
    setSelectedStatus(status);
  };

  const handleReviewClick = (detail) => {
    setSelectedReviewDetail(detail);
    setPopupOpen(true);
  };

  const handleOrderAction = (path, orderId) => {
    navigate(`${path}/${orderId}`);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleOrdersPerPageChange = (event) => {
    setOrdersPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="purchase">
      <div className="status-tabs">
        <ul>
          {statusTabs.map((tab) => (
            <li
              key={tab.key}
              className={selectedStatus === tab.key ? "active" : ""}
              onClick={() => handleStatusTab(tab.key)}
            >
              {tab.label} {selectedStatus === tab.key && `(${orders.length})`}
            </li>
          ))}
        </ul>
      </div>

      {orders.length > 0 ? (
        currentOrders.map((order) => (
          <div key={order.orderId} className="order">
            <div className="order-header">
              <div className="order-code">
                Order Code: {order.orderCode ? order.orderCode : order.orderId}
              </div>
              <div className="order-status">
                <span className="status success">
                  {order.status === "complete"
                    ? "Delivered Successfully"
                    : order.status}
                </span>
              </div>
            </div>

            {(order.details.$values || order.details).map((detail) => (
              <div
                key={detail.orderDetailId}
                className="order-body"
                style={{ cursor: "pointer" }}
                onClick={() => handleOrderAction("/product", detail.productId)}
              >
                <img
                  src={detail.productImage || "https://via.placeholder.com/100"}
                  alt={detail.productName}
                  className="product-img"
                />
                <div className="product-info">
                  <h3 className="product-title">{detail.productName}</h3>
                  <p className="product-variant">
                    {detail.size &&
                      `Variant: ${detail.size} x${detail.quantity}`}
                  </p>
                </div>
                <div className="product-price">
                  {detail.oldPrice && (
                    <span className="old-price">{detail.oldPrice}vnđ</span>
                  )}
                  <span className="new-price">{detail.price}vnđ</span>
                </div>

                {order.status && order.status.toLowerCase() === "complete" && (
                  <button
                    className="btn btn-rating"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReviewClick(detail);
                    }}
                  >
                    Review
                  </button>
                )}
              </div>
            ))}

            <div className="order-footer">
              <div className="total">
                Total: <span className="price">{order.totalAmount}vnđ</span>
              </div>
              <div className="actions">
                <button
                  className="btn btn-rating"
                  onClick={() => handleOrderAction("/purchase", order.orderId)}
                >
                  View Detail
                </button>
              </div>
            </div>

            <div className="extra-info">
              {order.extraInfo && <p>{order.extraInfo}</p>}
              <p>
                Payment Method: {order.paymentMethodName} | Order Date:{" "}
                {new Date(order.createdDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))
      ) : (
        <div className="order">
          <p>No orders found.</p>
        </div>
      )}

      {orders.length > 0 && (
        <Box className="pagination-container">
          <TextField
            select
            label="Orders per page"
            value={ordersPerPage}
            onChange={handleOrdersPerPageChange}
            variant="outlined"
            size="small"
            sx={{ width: 150, mr: 2 }}
          >
            {[10, 25, 50, 100].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      <Review
        isOpen={isPopupOpen}
        onClose={() => setPopupOpen(false)}
        detail={selectedReviewDetail}
      />
    </div>
  );
}
