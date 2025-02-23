import React, { useState, useEffect } from 'react';
import { BrandAPI } from '../../../store/apiBrand';
import { ProductAPI } from '../../../store/apiProduct';
import './BrandManagement.css';

const BrandManagement = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showBrandForm, setShowBrandForm] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [brandForm, setBrandForm] = useState({
    brandName: '',
    description: ''
  });
  const [productCounts, setProductCounts] = useState({});

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const response = await BrandAPI.getAll();
      let brandsData = [];
      if (Array.isArray(response)) {
        brandsData = response;
      } else if (response?.$values) {
        brandsData = response.$values;
      }
      setBrands(brandsData);

      // Lấy số lượng sản phẩm cho mỗi nhãn hiệu
      const counts = {};
      for (const brand of brandsData) {
        const count = await ProductAPI.getCountByBrand(brand.brandId);
        counts[brand.brandId] = count;
      }
      setProductCounts(counts);
    } catch (err) {
      setError('Không thể kết nối đến server. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const showNotificationMessage = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleEditBrand = (brand) => {
    setSelectedBrand(brand);
    setBrandForm({
      brandName: brand.brandName,
      description: brand.description
    });
    setShowBrandForm(true);
  };

  const handleDeleteBrand = async (brandId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhãn hiệu này?')) {
      try {
        await BrandAPI.delete(brandId);
        showNotificationMessage('Xóa nhãn hiệu thành công!');
        fetchBrands();
      } catch (err) {
        setError('Không thể xóa nhãn hiệu');
      }
    }
  };

  const handleSubmitBrand = async (e) => {
    e.preventDefault();
    if (!brandForm.brandName.trim()) {
      setError('Tên nhãn hiệu không được để trống');
      return;
    }

    try {
      setLoading(true);
      if (selectedBrand) {
        await BrandAPI.update(selectedBrand.brandId, brandForm);
        showNotificationMessage('Cập nhật nhãn hiệu thành công!');
      } else {
        await BrandAPI.create(brandForm);
        showNotificationMessage('Thêm nhãn hiệu thành công!');
      }
      setShowBrandForm(false);
      setBrandForm({ brandName: '', description: '' });
      setSelectedBrand(null);
      fetchBrands();
    } catch (err) {
      setError(selectedBrand ? 'Không thể cập nhật nhãn hiệu' : 'Không thể thêm nhãn hiệu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="brand-management">
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      <div className="management-header">
        <h1>Quản lý Nhãn hiệu</h1>
        <div className="header-actions">
          <button onClick={() => { setShowBrandForm(true); setSelectedBrand(null); }}>
            Thêm nhãn hiệu
          </button>
        </div>
      </div>

      {showBrandForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedBrand ? 'Sửa nhãn hiệu' : 'Thêm nhãn hiệu mới'}</h2>
            <form onSubmit={handleSubmitBrand}>
              <div className="form-group">
                <label>Tên nhãn hiệu: <span className="required">*</span></label>
                <input
                  type="text"
                  value={brandForm.brandName}
                  onChange={(e) => setBrandForm({
                    ...brandForm,
                    brandName: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mô tả:</label>
                <textarea
                  value={brandForm.description}
                  onChange={(e) => setBrandForm({
                    ...brandForm,
                    description: e.target.value
                  })}
                />
              </div>
              <div className="modal-actions">
                <button type="submit">
                  {selectedBrand ? 'Cập nhật' : 'Thêm mới'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowBrandForm(false);
                    setBrandForm({ brandName: '', description: '' });
                    setSelectedBrand(null);
                  }}
                  className="cancel-button"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">Đang tải dữ liệu...</div>
      ) : (
        <div className="brands-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên nhãn hiệu</th>
                <th>Mô tả</th>
                <th>Số lượng sản phẩm</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr key={brand.brandId}>
                  <td>{brand.brandId}</td>
                  <td>{brand.brandName}</td>
                  <td>{brand.description}</td>
                  <td>{productCounts[brand.brandId] || 0} sản phẩm</td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => handleEditBrand(brand)}>Sửa</button>
                      <button 
                        onClick={() => handleDeleteBrand(brand.brandId)}
                        className="delete-button"
                      >
                        Xóa
                      </button>
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

export default BrandManagement;
