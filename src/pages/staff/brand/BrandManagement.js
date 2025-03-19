import React, { useState, useEffect } from 'react';
import { BrandAPI } from '../../../store/apiBrand';
import { ProductAPI } from '../../../store/apiProduct';
//import { useNavigate } from 'react-router-dom';
import './BrandManagement.css';

const BrandManagement = () => {
  // const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showBrandForm, setShowBrandForm] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [brandForm, setBrandForm] = useState({
    brandName: ''
  });
  const [allProducts, setAllProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [showProductDetailModal, setShowProductDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchBrands();
    fetchAllProducts();
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
    } catch (err) {
      setError('Cannot connect to the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    setLoadingProducts(true);
    try {
      let currentPage = 1;
      let allFetchedProducts = [];
      let hasMorePages = true;

      while (hasMorePages) {
        const response = await ProductAPI.getAll({
          pageIndex: currentPage,
          pageSize: 100,
          SortTypes: [""],
          CategoryIds: [],
          SizeTypes: [""],
          Ingredients: [],
          BrandIds: [],
          FunctionIds: [],
          MinPrice: 0,
          MaxPrice: 999999999,
          Status: true
        });

        if (response && response.products) {
          const activeProducts = response.products.filter(product => product.status === true);
          allFetchedProducts = [...allFetchedProducts, ...activeProducts];

          if (!response.pagination || currentPage >= response.pagination.totalPages) {
            hasMorePages = false;
          } else {
            currentPage++;
          }
        } else {
          hasMorePages = false;
        }
      }

      setAllProducts(allFetchedProducts);
    } catch (err) {
      setError('Cannot load products. Please try again later.');
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleBrandClick = (brand) => {
    setSelectedBrand(brand);
    setShowProductsModal(true);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowProductDetailModal(true);
  };

  // Lọc sản phẩm theo brand được chọn
  const filteredProducts = selectedBrand
    ? allProducts.filter(product => product.brand && product.brand.brandId === selectedBrand.brandId)
    : [];

  const showNotificationMessage = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmitBrand = async (e) => {
    e.preventDefault();
    if (!brandForm.brandName.trim()) {
      setError('Brand name cannot be empty');
      return;
    }

    try {
      setLoading(true);
      if (selectedBrand) {
        await BrandAPI.update(selectedBrand.brandId, brandForm);
        showNotificationMessage('Brand updated successfully!');
      } else {
        await BrandAPI.create(brandForm);
        showNotificationMessage('Brand added successfully!');
      }
      setShowBrandForm(false);
      setBrandForm({ brandName: '' });
      setSelectedBrand(null);
      fetchBrands();
      fetchAllProducts(); // Refresh products after brand changes
    } catch (err) {
      setError(selectedBrand ? 'Cannot update brand' : 'Cannot add brand');
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
        <h1>Brand Management</h1>
        <div className="header-actions">
          <button onClick={() => { setShowBrandForm(true); setSelectedBrand(null); }}>
            Add Brand
          </button>
        </div>
      </div>

      {showBrandForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedBrand ? 'Edit Brand' : 'Add New Brand'}</h2>
            <form onSubmit={handleSubmitBrand}>
              <div className="form-group">
                <label>Brand Name: <span className="required">*</span></label>
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
              <div className="modal-actions">
                <button type="submit">
                  {selectedBrand ? 'Update' : 'Add New'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowBrandForm(false);
                    setBrandForm({ brandName: '' });
                    setSelectedBrand(null);
                  }}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">Loading data...</div>
      ) : (
        <div className="brands-container">
          <div className="brands-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Brand Name</th>
                </tr>
              </thead>
              <tbody>
                {brands.map((brand) => (
                  <tr
                    key={brand.brandId}
                    onClick={() => handleBrandClick(brand)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{brand.brandId}</td>
                    <td>{brand.brandName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal hiển thị danh sách sản phẩm của brand */}
      {showProductsModal && selectedBrand && (
        <div className="modal">
          <div className="modal-content product-list-modal">
            <div className="modal-header">
              <h2>Products of {selectedBrand.brandName}</h2>
              <button
                onClick={() => {
                  setShowProductsModal(false);
                  setSelectedBrand(null);
                }}
                className="close-button"
              >
                ✕
              </button>
            </div>
            <div className="products-content">
              {loadingProducts ? (
                <div className="loading-spinner">Loading products...</div>
              ) : filteredProducts.length === 0 ? (
                <div className="no-products">No products for this brand.</div>
              ) : (
                <div className="products-grid">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.productId}
                      className="product-card"
                      onClick={() => handleProductClick(product)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img src={product.productImage} alt={product.productName} />
                      <div className="product-info">
                        <h3>{product.productName}</h3>
                        <p className="price">
                          {product.discount > 0 ? (
                            <>
                              <span className="original-price">{product.price.toLocaleString()}đ</span>
                              <span className="discounted-price">
                                {(product.price * (1 - product.discount)).toLocaleString()}đ
                              </span>
                            </>
                          ) : (
                            <span>{product.price.toLocaleString()}đ</span>
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal hiển thị chi tiết sản phẩm */}
      {showProductDetailModal && selectedProduct && (
        <div className="modal">
          <div className="modal-content product-detail-modal">
            <div className="modal-header">
              <h2>Product Details</h2>
              <button
                onClick={() => {
                  setShowProductDetailModal(false);
                  setSelectedProduct(null);
                }}
                className="close-button"
              >
                ✕
              </button>
            </div>
            <div className="product-detail-content">
              <div className="product-image-section">
                <img
                  src={selectedProduct.productImage}
                  alt={selectedProduct.productName}
                  className="product-detail-image"
                />
              </div>
              <div className="product-info-section">
                <h3>{selectedProduct.productName}</h3>
                <p className="product-summary">{selectedProduct.summary}</p>
                <div className="product-details">
                  <p><strong>Brand:</strong> {selectedProduct.brand.brandName}</p>
                  <p><strong>Category:</strong> {selectedProduct.category?.categoryName}</p>
                  <p><strong>Price:</strong> {selectedProduct.price.toLocaleString()}đ</p>
                  {selectedProduct.discount > 0 && (
                    <p>
                      <strong>Discounted Price:</strong> {(selectedProduct.price * (1 - selectedProduct.discount)).toLocaleString()}đ
                      <span className="discount-tag">-{(selectedProduct.discount * 100).toFixed(0)}%</span>
                    </p>
                  )}
                  <p><strong>Stock Quantity:</strong> {selectedProduct.quantity}</p>
                  {selectedProduct.skinTypes?.$values && (
                    <div className="skin-types">
                      <strong>Suitable Skin Types:</strong>
                      <div className="tags">
                        {selectedProduct.skinTypes.$values.map(type => (
                          <span key={type.skinTypeId} className="tag">{type.skinTypeName}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {notification && <div className="notification">{notification}</div>}
    </div>
  );
};

export default BrandManagement;
