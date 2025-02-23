import React, { useState, useEffect } from 'react';
import { OrderAPI } from '../../../store/apiOrder';
import './OrderList.css';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await OrderAPI.getAll(1, 10);
      if (Array.isArray(response)) {
        setOrders(response);
      } else if (response?.$values) {
        setOrders(response.$values);
      } else {
        setOrders([]);
        setError('Dữ liệu không hợp lệ');
      }
    } catch (err) {
      setError('Không thể kết nối đến server. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const showNotificationMessage = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleViewDetails = async (order) => {
    try {
      const orderDetails = await OrderAPI.getDetail(order.orderId);
      setSelectedOrder(orderDetails);
      setShowOrderDetails(true);
    } catch (err) {
      setError('Không thể lấy chi tiết đơn hàng');
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const updatedOrder = await OrderAPI.updateStatus(orderId, newStatus);
      setOrders(prev => prev.map(order => 
        order.orderId === updatedOrder.orderId ? updatedOrder : order
      ));
      showNotificationMessage('Cập nhật trạng thái đơn hàng thành công!');
    } catch (err) {
      setError('Không thể cập nhật trạng thái đơn hàng');
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const updatedOrder = await OrderAPI.cancel(orderId);
      setOrders(prev => prev.map(order => 
        order.orderId === updatedOrder.orderId ? updatedOrder : order
      ));
      showNotificationMessage('Hủy đơn hàng thành công!');
    } catch (err) {
      setError('Không thể hủy đơn hàng');
    }
  };

  return (
    <div className="order-management">
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      <div className="management-header">
        <h1>Quản lý Đơn hàng</h1>
      </div>

      {showOrderDetails && selectedOrder && (
        <div className="modal">
          <div className="modal-content">
            <h2>Chi tiết đơn hàng #{selectedOrder.orderId}</h2>
            <div className="order-detail">
              <div className="detail-info">
                <p><strong>Khách hàng:</strong> {selectedOrder.customerName}</p>
                <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                <p><strong>Số điện thoại:</strong> {selectedOrder.customerPhone}</p>
                <p><strong>Địa chỉ:</strong> {selectedOrder.shippingAddress}</p>
                <p><strong>Ngày đặt:</strong> {new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
                <p><strong>Trạng thái:</strong> {selectedOrder.status}</p>
                <p><strong>Tổng tiền:</strong> {
                  new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(selectedOrder.totalAmount)
                }</p>
              </div>
              <div className="order-items">
                <h3>Sản phẩm</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Số lượng</th>
                      <th>Đơn giá</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.orderItems?.map((item, index) => (
                      <tr key={`item-${index}`}>
                        <td>{item.productName}</td>
                        <td>{item.quantity}</td>
                        <td>
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                          }).format(item.price)}
                        </td>
                        <td>
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                          }).format(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowOrderDetails(false)}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">Đang tải dữ liệu...</div>
      ) : (
        <div className="orders-table">
          <table>
            <thead>
              <tr>
                <th>Mã đơn hàng</th>
                <th>Khách hàng</th>
                <th>Ngày đặt</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={`order-${order.orderId}-${index}`} onClick={() => handleViewDetails(order)}>
                  <td>{order.orderId}</td>
                  <td>{order.customerName}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(order.totalAmount)}
                  </td>
                  <td>{order.status}</td>
                  <td>
                    <div className="action-buttons">
                      <select
                        value={order.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleUpdateStatus(order.orderId, e.target.value);
                        }}
                      >
                        <option value="pending">Chờ xử lý</option>
                        <option value="processing">Đang xử lý</option>
                        <option value="shipped">Đã giao hàng</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="cancelled">Đã hủy</option>
                      </select>
                      {order.status !== 'cancelled' && order.status !== 'completed' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelOrder(order.orderId);
                          }}
                          className="cancel-button"
                        >
                          Hủy đơn
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {notification && <div className="notification">{notification}</div>}
    </div>
  );
};

export default OrderList; 