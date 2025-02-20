import React, { useState } from 'react';
import './OrderList.css';

const OrderList = ({ orders, onUpdateStatus }) => {
  const [filterStatus, setFilterStatus] = useState('all');

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'orange';
      case 'processing': return 'blue';
      case 'shipping': return 'purple';
      case 'completed': return 'green';
      case 'cancelled': return 'red';
      default: return 'grey';
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  return (
    <div className="order-list">
      <div className="order-header">
        <h2>Quản lý đơn hàng</h2>
        <div className="filter-section">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tất cả đơn hàng</option>
            <option value="pending">Chờ xử lý</option>
            <option value="processing">Đang xử lý</option>
            <option value="shipping">Đang giao hàng</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      <div className="orders-container">
        {filteredOrders.map(order => (
          <div key={order.id} className="order-item">
            <div className="order-header">
              <h3>Đơn hàng #{order.id}</h3>
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(order.status) }}
              >
                {order.status}
              </span>
            </div>

            <div className="order-details">
              <div className="customer-info">
                <p><strong>Khách hàng:</strong> {order.customerName}</p>
                <p><strong>Số điện thoại:</strong> {order.phone}</p>
                <p><strong>Địa chỉ:</strong> {order.address}</p>
              </div>

              <div className="products-list">
                {order.products.map(product => (
                  <div key={product.id} className="product-item">
                    <img src={product.image} alt={product.name} />
                    <div className="product-details">
                      <p>{product.name}</p>
                      <p>Số lượng: {product.quantity}</p>
                      <p>Giá: ${product.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-summary">
                <p><strong>Tổng tiền:</strong> ${order.total}</p>
                <p><strong>Phương thức thanh toán:</strong> {order.paymentMethod}</p>
              </div>

              <div className="order-actions">
                <select 
                  value={order.status}
                  onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                >
                  <option value="pending">Chờ xử lý</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="shipping">Đang giao hàng</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderList; 