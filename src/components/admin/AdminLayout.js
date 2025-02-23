import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <nav className="admin-sidebar">
        <h2>Staff</h2>
        <ul>
          <li>
            <Link to="/admin/categories">Quản lý danh mục</Link>
          </li>
          <li>
            <Link to="/admin/products">Quản lý sản phẩm</Link>
          </li>
          <li>
            <Link to="/admin/brands">Quản lý nhãn hiệu</Link>
          </li>
          <li>
            <Link to="/admin/orders">Quản lý đơn hàng</Link>
          </li>
        </ul>
      </nav>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout; 