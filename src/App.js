import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import ErrorBoundary from './components/ErrorBoundary';

// Admin Components
import ProductCategoryManagement from './components/product/ProductCategoryManagement';
import OrderList from './components/admin/OrderManagement/OrderList';

import AdminLayout from './components/admin/AdminLayout';

function App() {
  // State cho đơn hàng và tin nhắn
  const [orders, setOrders] = useState([]);
  const [questions, setQuestions] = useState([]);

  // Giả lập việc lấy dữ liệu từ API/Database
  useEffect(() => {
    // Hàm lấy đơn hàng
    const fetchOrders = async () => {
      try {
        // Tạm thời mock data orders để tránh lỗi
        const mockOrders = [
          // Thêm mock data nếu cần
        ];
        setOrders(mockOrders);
        
        // Khi có API thật, uncomment đoạn code dưới
        /*
        const response = await fetch('/api/orders');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setOrders(data);
        } else {
          throw new Error('Response không phải JSON');
        }
        */
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]); // Set empty array on error
      }
    };

    // Gọi API định kỳ để cập nhật dữ liệu
    fetchOrders();

    // Thiết lập interval để poll dữ liệu mới
    const ordersInterval = setInterval(fetchOrders, 30000); // Poll mỗi 30 giây

    // Cleanup intervals khi component unmount
    return () => {
      clearInterval(ordersInterval);
    };
  }, []);

  // Handlers
  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      // Thay thế bằng API call thực tế
      await fetch(`your-api-endpoint/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      // Cập nhật state local
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleQuestionReply = async (questionId, replyText) => {
    try {
      // Thay thế bằng API call thực tế
      await fetch(`your-api-endpoint/questions/${questionId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reply: replyText }),
      });

      // Cập nhật state local
      setQuestions(prevQuestions =>
        prevQuestions.map(question =>
          question.id === questionId
            ? { ...question, reply: replyText, status: 'answered' }
            : question
        )
      );
    } catch (error) {
      console.error('Error replying to question:', error);
    }
  };

  const handleAddToFAQ = async (question) => {
    try {
      // Thay thế bằng API call thực tế
      await fetch('your-api-endpoint/faqs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(question),
      });

      // Cập nhật state local
      setQuestions(prevQuestions =>
        prevQuestions.map(q =>
          q.id === question.id ? { ...q, isFAQ: true } : q
        )
      );
    } catch (error) {
      console.error('Error adding to FAQ:', error);
    }
  };

  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/admin/products" replace />} />

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/products" replace />} />
              <Route path="products" element={<ProductCategoryManagement />} />
              <Route path="orders" element={
                <OrderList
                  orders={orders}
                  onUpdateStatus={handleOrderStatusUpdate}
                />
              } />

            </Route>
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
