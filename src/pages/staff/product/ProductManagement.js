import React, { useState, useEffect } from 'react';
import { ProductAPI } from '../../../store/apiProduct';
import { BrandAPI } from '../../../store/apiBrand';
import { CategoryAPI } from '../../../store/apiCategory';
import { FunctionAPI } from '../../../store/apiFunction';
import { IngredientAPI } from '../../../store/apiIngredient';
import { SkinTypeAPI } from '../../../store/apiSkinType';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: 'success' });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [functions, setFunctions] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [skinTypes, setSkinTypes] = useState([]);
  const [editedProduct, setEditedProduct] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    productName: '',
    summary: '',
    size: '',
    weight: '',
    price: '',
    quantity: '',
    discount: '',
    brandId: '',
    categoryId: '',
    skinTypes: [],
    ingredients: [],
    functions: [],
    images: []
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [showEditForm, setShowEditForm] = useState(false);

  const containerStyle = {
    padding: '20px',
    minHeight: '100vh',
    backgroundColor: '#f5f7fa',
  };

  const contentWrapperStyle = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    padding: '16px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const tableContainerStyle = {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    overflow: 'auto',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
  };

  const thStyle = {
    backgroundColor: '#f5f5f5',
    padding: '12px',
    textAlign: 'left',
    borderBottom: '2px solid #ddd',
    color: '#333',
    fontWeight: 'bold',
  };

  const tdStyle = {
    padding: '12px',
    borderBottom: '1px solid #ddd',
    color: '#666',
  };

  const buttonStyle = {
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'background-color 0.3s',
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#4CAF50',
    color: 'white',
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#f5f5f5',
    color: '#333',
    border: '1px solid #ddd',
  };

  const modalStyle = {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const modalContentStyle = {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '8px',
    width: '95%',
    maxWidth: '1200px',
    maxHeight: '95vh',
    overflowY: 'auto',
  };

  const formGroupStyle = {
    marginBottom: '16px',
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    color: '#333',
    fontWeight: '500',
  };

  const imagePreviewStyle = {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '4px',
    margin: '4px',
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '150px',
    resize: 'vertical',
    fontFamily: 'inherit',
    lineHeight: '1.5'
  };

  const dropdownStyle = {
    position: 'relative',
    width: '100%',
    marginBottom: '8px'
  };

  const dropdownButtonStyle = {
    ...inputStyle,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    backgroundColor: 'white',
    minHeight: '38px'
  };

  const dropdownContentStyle = {
    position: 'absolute',
    top: '100%',
    left: '0',
    right: '0',
    maxHeight: '250px',
    overflowY: 'auto',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '4px',
    zIndex: 1000,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const dropdownItemStyle = {
    padding: '8px 12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#f5f5f5'
    }
  };

  const selectedItemsStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
    padding: '4px'
  };

  const selectedItemStyle = {
    backgroundColor: '#e3f2fd',
    borderRadius: '16px',
    padding: '2px 8px',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  };

  const [dropdownStates, setDropdownStates] = useState({
    skinTypes: false,
    functions: false,
    ingredients: false,
    editSkinTypes: false,
    editFunctions: false,
    editIngredients: false
  });

  const toggleDropdown = (dropdown) => {
    setDropdownStates(prev => ({
      ...prev,
      [dropdown]: !prev[dropdown]
    }));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.dropdown-container')) {
        setDropdownStates({
          skinTypes: false,
          functions: false,
          ingredients: false,
          editSkinTypes: false,
          editFunctions: false,
          editIngredients: false
        });
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handlePageChange = async (pageNumber) => {
    setCurrentPage(pageNumber);
    await fetchProducts(pageNumber);
    window.scrollTo(0, 0);
  };

  const fetchProducts = async (pageNumber = 1) => {
    setLoading(true);
    setError(null);

    try {
      console.log('Fetching products for page:', pageNumber);
      const response = await ProductAPI.getAll({
        pageIndex: pageNumber
      });
      console.log('Fetched products response:', response);

      if (response && response.products) {
        setProducts(response.products);
        setTotalItems(response.pagination.totalItems);
        setTotalPages(response.pagination.totalPages);
        setCurrentPage(response.pagination.currentPage);

        console.log('Total products loaded:', response.products.length);
        console.log('Total pages:', response.pagination.totalPages);
        console.log('Current page:', response.pagination.currentPage);
        console.log('Total items:', response.pagination.totalItems);
      } else {
        console.error('Invalid response format:', response);
        setProducts([]);
        setTotalItems(0);
        setTotalPages(0);
        setCurrentPage(1);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Không thể kết nối đến server. Vui lòng thử lại sau.');
      setProducts([]);
      setTotalPages(0);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsResponse, categoriesResponse, functionsResponse, ingredientsResponse, skinTypesResponse] = await Promise.all([
          BrandAPI.getAll(),
          CategoryAPI.getAll(),
          FunctionAPI.getAll(),
          IngredientAPI.getAll(),
          SkinTypeAPI.getAll()
        ]);

        if (Array.isArray(brandsResponse)) {
          setBrands(brandsResponse);
        } else if (brandsResponse?.$values) {
          setBrands(brandsResponse.$values);
        } else {
          setBrands([]);
        }

        if (Array.isArray(categoriesResponse)) {
          setCategories(categoriesResponse);
        } else if (categoriesResponse?.$values) {
          setCategories(categoriesResponse.$values);
        } else {
          setCategories([]);
        }

        if (Array.isArray(functionsResponse)) {
          setFunctions(functionsResponse);
        } else if (functionsResponse?.$values) {
          setFunctions(functionsResponse.$values);
        } else {
          setFunctions([]);
        }

        if (Array.isArray(ingredientsResponse)) {
          setIngredients(ingredientsResponse);
        } else if (ingredientsResponse?.$values) {
          setIngredients(ingredientsResponse.$values);
        } else {
          setIngredients([]);
        }

        if (Array.isArray(skinTypesResponse)) {
          setSkinTypes(skinTypesResponse);
        } else if (skinTypesResponse?.$values) {
          setSkinTypes(skinTypesResponse.$values);
        } else {
          setSkinTypes([]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setBrands([]);
        setCategories([]);
        setFunctions([]);
        setIngredients([]);
        setSkinTypes([]);
      }
    };
    fetchData();
  }, []);

  const showNotificationMessage = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: 'success' }), 3000);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(null);
    fetchProductDetail(product.productId);
  };

  const fetchProductDetail = async (productId) => {
    try {
      const detail = await ProductAPI.getDetail(productId);
      setSelectedProduct(detail);
    } catch (error) {
      setError('Không thể lấy chi tiết sản phẩm');
    }
  };

  const handleBackToList = () => {
    setSelectedProduct(null);
  };

  const handleEditProduct = (product) => {
    console.log('Original product data:', product);

    const existingImages = product.productImages?.$values?.map(img => ({
      id: img.productImageId,
      url: img.productImage,
      isExisting: true
    })) || [];

    console.log('Initialized existing images:', existingImages);

    setEditedProduct({
      productId: product.productId,
      productName: product.productName,
      size: product.size,
      price: product.price,
      weight: product.weight || 0,
      quantity: product.quantity,
      discount: product.discount,
      summary: product.summary,
      isRecommended: product.isRecommended || false,
      brandId: product.brand?.brandId,
      categoryId: product.category?.categoryId,
      skinTypes: product.skinTypes?.$values?.map(skin => skin.skinTypeId) || [],
      ingredients: product.ingredients?.$values?.map(ing => ({
        ingredientId: ing.ingredientId,
        concentration: ing.concentration
      })) || [],
      functions: product.functions?.$values?.map(func => func.functionId) || [],
      images: existingImages,
      productImages: product.productImages
    });
    setShowEditForm(true);
  };

  const handleNewProductChange = (field, value) => {
    setNewProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageFile = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleNewProductChange('images', [e.target.result]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditFormSubmit = async () => {
    try {
      setLoading(true);

      if (!editedProduct.productName?.trim()) {
        throw new Error('Product name is required');
      }

      const price = parseFloat(editedProduct.price);
      const quantity = parseInt(editedProduct.quantity);
      const discount = parseFloat(editedProduct.discount);
      const weight = parseFloat(editedProduct.weight);
      const brandId = parseInt(editedProduct.brandId);
      const categoryId = parseInt(editedProduct.categoryId);

      if (isNaN(price) || price < 0) {
        throw new Error('Invalid price');
      }
      if (isNaN(quantity) || quantity < 0) {
        throw new Error('Invalid quantity');
      }
      if (isNaN(discount) || discount < 0 || discount > 1) {
        throw new Error('Discount must be between 0 and 1');
      }
      if (isNaN(weight) || weight < 0) {
        throw new Error('Invalid weight');
      }
      if (isNaN(brandId) || brandId <= 0) {
        throw new Error('Please select a brand');
      }
      if (isNaN(categoryId) || categoryId <= 0) {
        throw new Error('Please select a category');
      }

      const allImageUrls = editedProduct.images.map(img => img.url || img);

      console.log('All image URLs to be updated:', allImageUrls);

      const ingredientsData = editedProduct.ingredients.map(ing => ({
        ingredientId: ing.ingredientId,
        concentration: ing.concentration || ''
      }));

      const updateData = {
        productName: editedProduct.productName.trim(),
        size: editedProduct.size.trim(),
        price: price,
        weight: weight,
        quantity: quantity,
        discount: discount,
        summary: editedProduct.summary?.trim() || '',
        isRecommended: Boolean(editedProduct.isRecommended),
        brandId: brandId,
        categoryId: categoryId,
        skinTypeIds: editedProduct.skinTypes || [],
        ingredientConcentrations: ingredientsData,
        functionIds: editedProduct.functions || [],
        imageUrls: allImageUrls,
        status: editedProduct.status
      };

      console.log('Update data being sent:', updateData);

      await ProductAPI.update(editedProduct.productId, updateData);
      showNotificationMessage('Product updated successfully!', 'success');
      setShowEditForm(false);

      setTimeout(async () => {
        await fetchProductDetail(editedProduct.productId);
        await fetchProducts(currentPage);
      }, 500);
    } catch (error) {
      console.error('Error updating product:', error);
      showNotificationMessage(error.message || 'Failed to update product', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!newProduct.productName?.trim()) {
        throw new Error('Please enter product name');
      }

      const price = parseFloat(newProduct.price);
      const quantity = parseInt(newProduct.quantity);
      const discount = parseFloat(newProduct.discount);
      const brandId = parseInt(newProduct.brandId);
      const categoryId = parseInt(newProduct.categoryId);

      if (isNaN(price) || price < 0) {
        throw new Error('Invalid price');
      }
      if (isNaN(quantity) || quantity < 0) {
        throw new Error('Invalid quantity');
      }
      if (isNaN(discount) || discount < 0 || discount > 1) {
        throw new Error('Discount must be between 0 and 1');
      }
      if (isNaN(brandId) || brandId <= 0) {
        throw new Error('Please select a brand');
      }
      if (isNaN(categoryId) || categoryId <= 0) {
        throw new Error('Please select a category');
      }

      const productToCreate = {
        productName: newProduct.productName,
        summary: newProduct.summary,
        size: newProduct.size,
        price: price,
        quantity: quantity,
        discount: discount,
        isRecommended: newProduct.isRecommended,
        brandId: brandId,
        categoryId: categoryId,
        skinTypes: newProduct.skinTypes,
        ingredients: newProduct.ingredients,
        functions: newProduct.functions,
        images: newProduct.images
      };

      console.log('Attempting to create product with data:', productToCreate);

      const createResponse = await ProductAPI.create(productToCreate);
      console.log('Create product response:', createResponse);

      if (!createResponse) {
        throw new Error('No response received when creating product');
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Refreshing product list...');
      const response = await ProductAPI.getAll({ pageIndex: 1 });
      const lastPage = Math.ceil(response.pagination.totalItems / itemsPerPage);

      await fetchProducts(lastPage);
      setCurrentPage(lastPage);

      setShowCreateForm(false);
      setNewProduct({
        productName: '',
        summary: '',
        size: '',
        weight: '',
        price: '',
        quantity: '',
        discount: '',
        brandId: '',
        categoryId: '',
        skinTypes: [],
        ingredients: [],
        functions: [],
        images: []
      });
      showNotificationMessage('Product created successfully!', 'success');
    } catch (error) {
      console.error('Error in handleCreateProduct:', error);
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.detail
        || error.response?.data?.message
        || error.message
        || 'Failed to create product. Please try again!';

      showNotificationMessage(errorMessage, 'error');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleActivateProduct = async (productId) => {
    try {
      await ProductAPI.activate(productId);
      showNotificationMessage('Kích hoạt sản phẩm thành công!', 'success');
      setSelectedProduct(prev => ({ ...prev, status: true }));
      await fetchProducts(currentPage);
    } catch (error) {
      showNotificationMessage(error.message || 'Không thể kích hoạt sản phẩm', 'error');
    }
  };

  const handleDeactivateProduct = async (productId) => {
    try {
      await ProductAPI.deactivate(productId);
      showNotificationMessage('Ngừng kích hoạt sản phẩm thành công!', 'success');
      setSelectedProduct(prev => ({ ...prev, status: false }));
      await fetchProducts(currentPage);
    } catch (error) {
      showNotificationMessage(error.message || 'Không thể ngừng kích hoạt sản phẩm', 'error');
    }
  };

  return (
    <div style={containerStyle}>
      <div style={contentWrapperStyle}>
        <div style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {selectedProduct ? (
              <>
                <button onClick={handleBackToList} style={secondaryButtonStyle}>
                  Back to Product List
                </button>
                <h1 style={{ margin: 0, fontSize: '24px', color: '#333' }}>
                  Product Details: {selectedProduct.productName}
                </h1>
              </>
            ) : (
              <h1 style={{ margin: 0, fontSize: '24px', color: '#333' }}>Product Management</h1>
            )}
          </div>
          {!selectedProduct && (
            <button onClick={() => setShowCreateForm(true)} style={primaryButtonStyle}>
              Add New Product
            </button>
          )}
        </div>

        {!selectedProduct ? (
          <>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                Loading data...
              </div>
            ) : error ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#f44336' }}>
                {error}
              </div>
            ) : (
              <>
                <div style={tableContainerStyle}>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={{ ...thStyle, width: '10%' }}>Product ID</th>
                        <th style={{ ...thStyle, width: '25%' }}>Product Name</th>
                        <th style={{ ...thStyle, width: '15%' }}>Price</th>
                        <th style={{ ...thStyle, width: '10%' }}>Discount</th>
                        <th style={{ ...thStyle, width: '10%' }}>Quantity</th>
                        <th style={{ ...thStyle, width: '15%' }}>Image</th>
                        <th style={{ ...thStyle, width: '15%' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr
                          key={product.productId}
                          onClick={() => handleViewDetails(product)}
                          style={{
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            ':hover': { backgroundColor: '#f5f5f5' }
                          }}
                        >
                          <td style={tdStyle}>{product.productId}</td>
                          <td style={tdStyle}>{product.productName}</td>
                          <td style={tdStyle}>
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND'
                            }).format(product.price)}
                          </td>
                          <td style={tdStyle}>{(product.discount * 100).toFixed(0)}%</td>
                          <td style={tdStyle}>{product.quantity}</td>
                          <td style={tdStyle}>
                            {product.productImage && (
                              <img
                                src={product.productImage}
                                alt={product.productName}
                                style={imagePreviewStyle}
                              />
                            )}
                          </td>
                          <td style={tdStyle}>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '500',

                              backgroundColor: product.status ? '#e8f5e9' : '#ffebee',
                              color: product.status ? '#2e7d32' : '#c62828',
                            }}>
                              {product.status ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '20px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    marginTop: '20px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      style={{
                        ...secondaryButtonStyle,
                        opacity: currentPage === 1 ? 0.5 : 1,
                      }}
                    >
                      &lt;
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => {
                      const pageNumber = index + 1;
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            style={{
                              ...buttonStyle,
                              backgroundColor: currentPage === pageNumber ? '#4CAF50' : '#fff',
                              color: currentPage === pageNumber ? '#fff' : '#333',
                              border: '1px solid #ddd',
                              minWidth: '40px',
                            }}
                          >
                            {pageNumber}
                          </button>
                        );
                      } else if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return (
                          <span
                            key={pageNumber}
                            style={{
                              padding: '8px',
                              color: '#666',
                            }}
                          >
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      style={{
                        ...secondaryButtonStyle,
                        opacity: currentPage === totalPages ? 0.5 : 1,
                      }}
                    >
                      &gt;
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <div>
                <h3 style={{ marginBottom: '16px', color: '#333' }}>Product Information</h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div>
                    <strong>Product Name:</strong> {selectedProduct.productName}
                  </div>
                  <div>
                    <strong>Price:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedProduct.price)}
                  </div>
                  <div>
                    <strong>Discount:</strong> {(selectedProduct.discount * 100).toFixed(0)}%
                  </div>
                  <div>
                    <strong>Quantity:</strong> {selectedProduct.quantity}
                  </div>
                  <div>
                    <strong>Size:</strong> {selectedProduct.size}
                  </div>
                  <div>

                    <strong>Status:</strong> {selectedProduct.status ? 'Active' : 'Inactive'}

                  </div>
                </div>
              </div>
              <div>
                <h3 style={{ marginBottom: '16px', color: '#333' }}>Category & Brand</h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div>
                    <strong>Brand:</strong> {selectedProduct.brand?.brandName}
                  </div>
                  <div>
                    <strong>Category:</strong> {selectedProduct.category?.categoryName}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ marginBottom: '16px', color: '#333' }}>Product Description</h3>
              <p style={{ whiteSpace: 'pre-wrap' }}>{selectedProduct.summary}</p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ marginBottom: '16px', color: '#333' }}>Skin Types</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedProduct.skinTypes?.$values.map(skin => (
                  <span key={skin.skinTypeId} style={{
                    padding: '4px 12px',
                    backgroundColor: '#e3f2fd',
                    borderRadius: '16px',
                    fontSize: '14px',
                    color: '#1976d2'
                  }}>
                    {skin.skinTypeName}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ marginBottom: '16px', color: '#333' }}>Functions</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedProduct.functions?.$values.map(func => (
                  <span key={func.functionId} style={{
                    padding: '4px 12px',
                    backgroundColor: '#f3e5f5',
                    borderRadius: '16px',
                    fontSize: '14px',
                    color: '#7b1fa2'
                  }}>
                    {func.functionName}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ marginBottom: '16px', color: '#333' }}>Ingredients</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ ...thStyle, width: '50%' }}>Ingredient Name</th>
                    <th style={{ ...thStyle, width: '50%' }}>Concentration</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProduct.ingredients?.$values.map(ingredient => (
                    <tr key={ingredient.ingredientId}>
                      <td style={tdStyle}>{ingredient.ingredientName}</td>
                      <td style={tdStyle}>{ingredient.concentration}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <h3 style={{ marginBottom: '16px', color: '#333' }}>Product Images</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                {selectedProduct.productImages?.$values.map(image => (
                  <img
                    key={image.productImageId}
                    src={image.productImage}
                    alt={selectedProduct.productName}
                    style={{
                      width: '200px',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
              <button
                onClick={() => handleEditProduct(selectedProduct)}
                style={{
                  ...primaryButtonStyle,
                  backgroundColor: '#2196F3'
                }}
              >
                Edit Product
              </button>
              <button
                onClick={() => handleActivateProduct(selectedProduct.productId)}
                style={{
                  ...primaryButtonStyle,
                  backgroundColor: '#4CAF50'
                }}
              >
                Activate Product
              </button>
              <button
                onClick={() => handleDeactivateProduct(selectedProduct.productId)}
                style={{
                  ...primaryButtonStyle,
                  backgroundColor: '#f44336'
                }}
              >
                Deactivate Product
              </button>

            </div>
          </div>
        )}

        {showCreateForm && (
          <div style={modalStyle}>
            <div style={modalContentStyle}>
              <h2 style={{ marginBottom: '20px', color: '#333' }}>Add New Product</h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Product Name:</label>
                    <input
                      type="text"
                      value={newProduct.productName}
                      onChange={(e) => handleNewProductChange('productName', e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Description:</label>
                    <textarea
                      value={newProduct.summary}
                      onChange={(e) => handleNewProductChange('summary', e.target.value)}
                      style={textareaStyle}
                    />
                  </div>

                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Size (ml):</label>
                    <input
                      type="number"
                      value={newProduct.size}
                      onChange={(e) => handleNewProductChange('size', e.target.value)}
                      min="0"
                      style={inputStyle}
                    />
                  </div>

                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Weight (g):</label>
                    <input
                      type="number"
                      value={newProduct.weight}
                      onChange={(e) => handleNewProductChange('weight', e.target.value)}
                      min="0"
                      style={inputStyle}
                    />
                  </div>

                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Price:</label>
                    <input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => handleNewProductChange('price', e.target.value)}
                      min="0"
                      style={inputStyle}
                    />
                  </div>

                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Quantity:</label>
                    <input
                      type="number"
                      value={newProduct.quantity}
                      onChange={(e) => handleNewProductChange('quantity', e.target.value)}
                      min="0"
                      style={inputStyle}
                    />
                  </div>

                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Discount:</label>
                    <input
                      type="number"
                      value={newProduct.discount}
                      onChange={(e) => handleNewProductChange('discount', e.target.value)}
                      min="0"
                      max="1"
                      step="0.01"
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Brand:</label>
                    <select
                      value={newProduct.brandId}
                      onChange={(e) => handleNewProductChange('brandId', e.target.value)}
                      style={inputStyle}
                    >
                      <option value="">Select Brand</option>
                      {brands.map(brand => (
                        <option key={brand.brandId} value={brand.brandId}>
                          {brand.brandName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Category:</label>
                    <select
                      value={newProduct.categoryId}
                      onChange={(e) => handleNewProductChange('categoryId', e.target.value)}
                      style={inputStyle}
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.categoryId} value={category.categoryId}>
                          {category.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Skin Types:</label>
                    <div className="dropdown-container" style={dropdownStyle}>
                      <div
                        style={dropdownButtonStyle}
                        onClick={() => toggleDropdown('skinTypes')}
                      >
                        <div style={selectedItemsStyle}>
                          {newProduct.skinTypes.length > 0 ? (
                            skinTypes
                              .filter(skin => newProduct.skinTypes.includes(skin.skinTypeId))
                              .map(skin => (
                                <span key={skin.skinTypeId} style={selectedItemStyle}>
                                  {skin.skinTypeName}
                                  <span
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleNewProductChange('skinTypes',
                                        newProduct.skinTypes.filter(id => id !== skin.skinTypeId)
                                      );
                                    }}
                                    style={{ cursor: 'pointer', marginLeft: '4px' }}
                                  >
                                    ×
                                  </span>
                                </span>
                              ))
                          ) : (
                            <span style={{ color: '#666' }}>Select Skin Types</span>
                          )}
                        </div>
                        <span>▼</span>
                      </div>
                      {dropdownStates.skinTypes && (
                        <div style={dropdownContentStyle}>
                          {skinTypes.map(skin => (
                            <div
                              key={skin.skinTypeId}
                              style={dropdownItemStyle}
                              onClick={() => {
                                const isSelected = newProduct.skinTypes.includes(skin.skinTypeId);
                                handleNewProductChange('skinTypes',
                                  isSelected
                                    ? newProduct.skinTypes.filter(id => id !== skin.skinTypeId)
                                    : [...newProduct.skinTypes, skin.skinTypeId]
                                );
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={newProduct.skinTypes.includes(skin.skinTypeId)}
                                onChange={(e) => { }}
                              />
                              {skin.skinTypeName}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Functions:</label>
                    <div className="dropdown-container" style={dropdownStyle}>
                      <div
                        style={dropdownButtonStyle}
                        onClick={() => toggleDropdown('functions')}
                      >
                        <div style={selectedItemsStyle}>
                          {newProduct.functions.length > 0 ? (
                            functions
                              .filter(func => newProduct.functions.includes(func.functionId))
                              .map(func => (
                                <span key={func.functionId} style={selectedItemStyle}>
                                  {func.functionName}
                                  <span
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleNewProductChange('functions',
                                        newProduct.functions.filter(id => id !== func.functionId)
                                      );
                                    }}
                                    style={{ cursor: 'pointer', marginLeft: '4px' }}
                                  >
                                    ×
                                  </span>
                                </span>
                              ))
                          ) : (
                            <span style={{ color: '#666' }}>Select Functions</span>
                          )}
                        </div>
                        <span>▼</span>
                      </div>
                      {dropdownStates.functions && (
                        <div style={dropdownContentStyle}>
                          {functions.map(func => (
                            <div
                              key={func.functionId}
                              style={dropdownItemStyle}
                              onClick={() => {
                                const isSelected = newProduct.functions.includes(func.functionId);
                                handleNewProductChange('functions',
                                  isSelected
                                    ? newProduct.functions.filter(id => id !== func.functionId)
                                    : [...newProduct.functions, func.functionId]
                                );
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={newProduct.functions.includes(func.functionId)}
                                onChange={(e) => { }}
                              />
                              {func.functionName}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Ingredients:</label>
                    <div className="dropdown-container" style={dropdownStyle}>
                      <div
                        style={dropdownButtonStyle}
                        onClick={() => toggleDropdown('ingredients')}
                      >
                        <div style={selectedItemsStyle}>
                          {newProduct.ingredients.length > 0 ? (
                            ingredients
                              .filter(ing => newProduct.ingredients.some(i => i.ingredientId === ing.ingredientId))
                              .map(ing => (
                                <span key={ing.ingredientId} style={selectedItemStyle}>
                                  {ing.ingredientName}
                                  ({newProduct.ingredients.find(i => i.ingredientId === ing.ingredientId)?.concentration !== undefined ? newProduct.ingredients.find(i => i.ingredientId === ing.ingredientId)?.concentration : ''}%)
                                  <span
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleNewProductChange('ingredients',
                                        newProduct.ingredients.filter(i => i.ingredientId !== ing.ingredientId)
                                      );
                                    }}
                                    style={{ cursor: 'pointer', marginLeft: '4px' }}
                                  >
                                    ×
                                  </span>
                                </span>
                              ))
                          ) : (
                            <span style={{ color: '#666' }}>Select Ingredients</span>
                          )}
                        </div>
                        <span>▼</span>
                      </div>
                      {dropdownStates.ingredients && (
                        <div style={dropdownContentStyle}>
                          {ingredients.map(ing => (
                            <div
                              key={ing.ingredientId}
                              style={{ ...dropdownItemStyle, flexWrap: 'wrap' }}
                            >
                              <div
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}
                                onClick={() => {
                                  const isSelected = newProduct.ingredients.some(i => i.ingredientId === ing.ingredientId);
                                  handleNewProductChange('ingredients',
                                    isSelected
                                      ? newProduct.ingredients.filter(i => i.ingredientId !== ing.ingredientId)
                                      : [...newProduct.ingredients, { ingredientId: ing.ingredientId, concentration: '' }]
                                  );
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={newProduct.ingredients.some(i => i.ingredientId === ing.ingredientId)}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    const isSelected = newProduct.ingredients.some(i => i.ingredientId === ing.ingredientId);
                                    handleNewProductChange('ingredients',
                                      isSelected
                                        ? newProduct.ingredients.filter(i => i.ingredientId !== ing.ingredientId)
                                        : [...newProduct.ingredients, { ingredientId: ing.ingredientId, concentration: '' }]
                                    );
                                  }}
                                />
                                <span>{ing.ingredientName}</span>
                              </div>
                              {newProduct.ingredients.some(i => i.ingredientId === ing.ingredientId) && (
                                <div style={{ width: '100%', paddingLeft: '24px', marginTop: '4px' }}>
                                  <input
                                    type="number"
                                    value={newProduct.ingredients.find(i => i.ingredientId === ing.ingredientId)?.concentration !== undefined ? newProduct.ingredients.find(i => i.ingredientId === ing.ingredientId)?.concentration : ''}
                                    onChange={(e) => {
                                      const newIngredients = newProduct.ingredients.map(i =>
                                        i.ingredientId === ing.ingredientId
                                          ? { ...i, concentration: e.target.value === '' ? '' : parseFloat(e.target.value) }
                                          : i
                                      );
                                      handleNewProductChange('ingredients', newIngredients);
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    style={{ ...inputStyle, width: '80px' }}
                                  />
                                  <span style={{ marginLeft: '4px' }}>%</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Product Images:</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                  {newProduct.images.map((image, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: '4px'
                        }}
                      />
                      <button
                        onClick={() => {
                          const newImages = newProduct.images.filter((_, i) => i !== index);
                          handleNewProductChange('images', newImages);
                        }}
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          backgroundColor: '#f44336',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="Enter image URL"
                      style={{ ...inputStyle, width: '200px' }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          const imageUrl = e.target.value.trim();
                          handleNewProductChange('images', [...newProduct.images, imageUrl]);
                          e.target.value = '';
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        const input = document.querySelector('input[placeholder="Enter image URL"]');
                        const imageUrl = input.value.trim();
                        if (imageUrl) {
                          handleNewProductChange('images', [...newProduct.images, imageUrl]);
                          input.value = '';
                        }
                      }}
                      style={{
                        ...primaryButtonStyle,
                        padding: '8px 16px',
                        height: '36px'
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button
                  onClick={handleCreateProduct}
                  style={primaryButtonStyle}
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Product'}
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  style={secondaryButtonStyle}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showEditForm && (
          <div style={modalStyle}>
            <div style={modalContentStyle}>
              <h2 style={{ marginBottom: '20px', color: '#333' }}>Edit Product</h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Product Name:</label>
                    <input
                      type="text"
                      value={editedProduct.productName}
                      onChange={(e) => setEditedProduct(prev => ({ ...prev, productName: e.target.value }))}
                      style={inputStyle}
                    />
                  </div>

                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Description:</label>
                    <textarea
                      value={editedProduct.summary}
                      onChange={(e) => setEditedProduct(prev => ({ ...prev, summary: e.target.value }))}
                      style={textareaStyle}
                    />
                  </div>

                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Size (ml):</label>
                    <input
                      type="number"
                      value={editedProduct.size}
                      onChange={(e) => setEditedProduct(prev => ({ ...prev, size: e.target.value }))}
                      min="0"
                      style={inputStyle}
                    />
                  </div>

                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Weight (g):</label>
                    <input
                      type="number"
                      value={editedProduct.weight}
                      onChange={(e) => setEditedProduct(prev => ({ ...prev, weight: e.target.value }))}
                      min="0"
                      style={inputStyle}
                    />
                  </div>

                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Price:</label>
                    <input
                      type="number"
                      value={editedProduct.price}
                      onChange={(e) => setEditedProduct(prev => ({ ...prev, price: e.target.value }))}
                      min="0"
                      style={inputStyle}
                    />
                  </div>

                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Quantity:</label>
                    <input
                      type="number"
                      value={editedProduct.quantity}
                      onChange={(e) => setEditedProduct(prev => ({ ...prev, quantity: e.target.value }))}
                      min="0"
                      style={inputStyle}
                    />
                  </div>

                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Discount:</label>
                    <input
                      type="number"
                      value={editedProduct.discount}
                      onChange={(e) => setEditedProduct(prev => ({ ...prev, discount: e.target.value }))}
                      min="0"
                      max="1"
                      step="0.01"
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Brand:</label>
                    <select
                      value={editedProduct.brandId}
                      onChange={(e) => setEditedProduct(prev => ({ ...prev, brandId: e.target.value }))}
                      style={inputStyle}
                    >
                      <option value="">Select Brand</option>
                      {brands.map(brand => (
                        <option key={brand.brandId} value={brand.brandId}>
                          {brand.brandName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Category:</label>
                    <select
                      value={editedProduct.categoryId}
                      onChange={(e) => setEditedProduct(prev => ({ ...prev, categoryId: e.target.value }))}
                      style={inputStyle}
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.categoryId} value={category.categoryId}>
                          {category.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Skin Types:</label>
                    <div className="dropdown-container" style={dropdownStyle}>
                      <div
                        style={dropdownButtonStyle}
                        onClick={() => toggleDropdown('editSkinTypes')}
                      >
                        <div style={selectedItemsStyle}>
                          {editedProduct.skinTypes.length > 0 ? (
                            skinTypes
                              .filter(skin => editedProduct.skinTypes.includes(skin.skinTypeId))
                              .map(skin => (
                                <span key={skin.skinTypeId} style={selectedItemStyle}>
                                  {skin.skinTypeName}
                                  <span
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditedProduct(prev => ({
                                        ...prev,
                                        skinTypes: prev.skinTypes.filter(id => id !== skin.skinTypeId)
                                      }));
                                    }}
                                    style={{ cursor: 'pointer', marginLeft: '4px' }}
                                  >
                                    ×
                                  </span>
                                </span>
                              ))
                          ) : (
                            <span style={{ color: '#666' }}>Select Skin Types</span>
                          )}
                        </div>
                        <span>▼</span>
                      </div>
                      {dropdownStates.editSkinTypes && (
                        <div style={dropdownContentStyle}>
                          {skinTypes.map(skin => (
                            <div
                              key={skin.skinTypeId}
                              style={dropdownItemStyle}
                              onClick={() => {
                                const isSelected = editedProduct.skinTypes.includes(skin.skinTypeId);
                                setEditedProduct(prev => ({
                                  ...prev,
                                  skinTypes: isSelected
                                    ? prev.skinTypes.filter(id => id !== skin.skinTypeId)
                                    : [...prev.skinTypes, skin.skinTypeId]
                                }));
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={editedProduct.skinTypes.includes(skin.skinTypeId)}
                                onChange={(e) => { }}
                              />
                              {skin.skinTypeName}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Functions:</label>
                    <div className="dropdown-container" style={dropdownStyle}>
                      <div
                        style={dropdownButtonStyle}
                        onClick={() => toggleDropdown('editFunctions')}
                      >
                        <div style={selectedItemsStyle}>
                          {editedProduct.functions.length > 0 ? (
                            functions
                              .filter(func => editedProduct.functions.includes(func.functionId))
                              .map(func => (
                                <span key={func.functionId} style={selectedItemStyle}>
                                  {func.functionName}
                                  <span
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditedProduct(prev => ({
                                        ...prev,
                                        functions: prev.functions.filter(id => id !== func.functionId)
                                      }));
                                    }}
                                    style={{ cursor: 'pointer', marginLeft: '4px' }}
                                  >
                                    ×
                                  </span>
                                </span>
                              ))
                          ) : (
                            <span style={{ color: '#666' }}>Select Functions</span>
                          )}
                        </div>
                        <span>▼</span>
                      </div>
                      {dropdownStates.editFunctions && (
                        <div style={dropdownContentStyle}>
                          {functions.map(func => (
                            <div
                              key={func.functionId}
                              style={dropdownItemStyle}
                              onClick={() => {
                                const isSelected = editedProduct.functions.includes(func.functionId);
                                setEditedProduct(prev => ({
                                  ...prev,
                                  functions: isSelected
                                    ? prev.functions.filter(id => id !== func.functionId)
                                    : [...prev.functions, func.functionId]
                                }));
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={editedProduct.functions.includes(func.functionId)}
                                onChange={(e) => { }}
                              />
                              {func.functionName}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Ingredients:</label>
                    <div className="dropdown-container" style={dropdownStyle}>
                      <div
                        style={dropdownButtonStyle}
                        onClick={() => toggleDropdown('editIngredients')}
                      >
                        <div style={selectedItemsStyle}>
                          {editedProduct.ingredients.length > 0 ? (
                            ingredients
                              .filter(ing => editedProduct.ingredients.some(i => i.ingredientId === ing.ingredientId))
                              .map(ing => (
                                <span key={ing.ingredientId} style={selectedItemStyle}>
                                  {ing.ingredientName}
                                  ({editedProduct.ingredients.find(i => i.ingredientId === ing.ingredientId)?.concentration !== undefined ? editedProduct.ingredients.find(i => i.ingredientId === ing.ingredientId)?.concentration : ''}%)
                                  <span
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditedProduct(prev => ({
                                        ...prev,
                                        ingredients: prev.ingredients.filter(i => i.ingredientId !== ing.ingredientId)
                                      }));
                                    }}
                                    style={{ cursor: 'pointer', marginLeft: '4px' }}
                                  >
                                    ×
                                  </span>
                                </span>
                              ))
                          ) : (
                            <span style={{ color: '#666' }}>Select Ingredients</span>
                          )}
                        </div>
                        <span>▼</span>
                      </div>
                      {dropdownStates.editIngredients && (
                        <div style={dropdownContentStyle}>
                          {ingredients.map(ing => (
                            <div
                              key={ing.ingredientId}
                              style={{ ...dropdownItemStyle, flexWrap: 'wrap' }}
                            >
                              <div
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}
                                onClick={() => {
                                  const isSelected = editedProduct.ingredients.some(i => i.ingredientId === ing.ingredientId);
                                  setEditedProduct(prev => ({
                                    ...prev,
                                    ingredients: isSelected
                                      ? prev.ingredients.filter(i => i.ingredientId !== ing.ingredientId)
                                      : [...prev.ingredients, { ingredientId: ing.ingredientId, concentration: '' }]
                                  }));
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={editedProduct.ingredients.some(i => i.ingredientId === ing.ingredientId)}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    const isSelected = editedProduct.ingredients.some(i => i.ingredientId === ing.ingredientId);
                                    setEditedProduct(prev => ({
                                      ...prev,
                                      ingredients: isSelected
                                        ? prev.ingredients.filter(i => i.ingredientId !== ing.ingredientId)
                                        : [...prev.ingredients, { ingredientId: ing.ingredientId, concentration: '' }]
                                    }));
                                  }}
                                />
                                <span>{ing.ingredientName}</span>
                              </div>
                              {editedProduct.ingredients.some(i => i.ingredientId === ing.ingredientId) && (
                                <div style={{ width: '100%', paddingLeft: '24px', marginTop: '4px' }}>
                                  <input
                                    type="number"
                                    value={editedProduct.ingredients.find(i => i.ingredientId === ing.ingredientId)?.concentration !== undefined ? editedProduct.ingredients.find(i => i.ingredientId === ing.ingredientId)?.concentration : ''}
                                    onChange={(e) => {
                                      const newIngredients = editedProduct.ingredients.map(i =>
                                        i.ingredientId === ing.ingredientId
                                          ? { ...i, concentration: e.target.value === '' ? '' : parseFloat(e.target.value) }
                                          : i
                                      );
                                      setEditedProduct(prev => ({
                                        ...prev,
                                        ingredients: newIngredients
                                      }));
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    style={{ ...inputStyle, width: '80px' }}
                                  />
                                  <span style={{ marginLeft: '4px' }}>%</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Product Images:</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                  {editedProduct.images?.map((image, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                      <img
                        src={image.url || image}
                        alt={`Product ${index + 1}`}
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: '4px'
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'placeholder-image-url';
                        }}
                      />
                      <button
                        onClick={() => {
                          const newImages = editedProduct.images.filter((_, i) => i !== index);
                          setEditedProduct(prev => ({ ...prev, images: newImages }));
                        }}
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          backgroundColor: '#f44336',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="Enter image URL"
                      style={{ ...inputStyle, width: '200px' }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          const imageUrl = e.target.value.trim();
                          setEditedProduct(prev => ({
                            ...prev,
                            images: [...prev.images, imageUrl]
                          }));
                          e.target.value = '';
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        const input = document.querySelector('input[placeholder="Enter image URL"]');
                        const imageUrl = input.value.trim();
                        if (imageUrl) {
                          setEditedProduct(prev => ({
                            ...prev,
                            images: [...prev.images, imageUrl]
                          }));
                          input.value = '';
                        }
                      }}
                      style={{
                        ...primaryButtonStyle,
                        padding: '8px 16px',
                        height: '36px'
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button
                  onClick={handleEditFormSubmit}
                  disabled={loading}
                  style={primaryButtonStyle}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => setShowEditForm(false)}
                  style={secondaryButtonStyle}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {notification.message && (
          <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: notification.type === 'success' ? '#4CAF50' : '#f44336',
            color: 'white',
            padding: '16px',
            borderRadius: '4px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            zIndex: 1000,
          }}>
            {notification.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;