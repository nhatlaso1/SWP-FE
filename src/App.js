import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import ErrorBoundary from './components/ErrorBoundary';

// Admin Components
import ProductManagement from './components/product/ProductManagement';
import CategoryManagement from './components/category/CategoryManagement';
import BrandManagement from './components/Brand/BrandManagement';
import OrderList from './components/order/OrderList';

import AdminLayout from './components/admin/AdminLayout';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/admin/products" replace />} />

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/products" replace />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="categories" element={<CategoryManagement />} />
              <Route path="brands" element={<BrandManagement />} />
              <Route path="orders" element={<OrderList />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
