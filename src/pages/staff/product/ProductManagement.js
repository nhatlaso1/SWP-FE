import React, { useState, useEffect } from 'react';
import { ProductAPI } from '../../../store/apiProduct';
import { BrandAPI } from '../../../store/apiBrand';
import { CategoryAPI } from '../../../store/apiCategory';
import { FunctionAPI } from '../../../store/apiFunction';
import { IngredientAPI } from '../../../store/apiIngredient';
import { SkinTypeAPI } from '../../../store/apiSkinType';
import './ProductManagement.css';

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

  const [dropdownStates, setDropdownStates] = useState({
    skinTypes: false,
    functions: false,
    ingredients: false,
    editSkinTypes: false,
    editFunctions: false,
    editIngredients: false
  });

  const toggleDropdown = (dropdown, e) => {
    if (e) {
      e.stopPropagation();
    }
    setDropdownStates(prev => ({
      ...prev,
      [dropdown]: !prev[dropdown]
    }));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      const dropdownContainer = e.target.closest('.product-management-dropdown-container');
      const isDropdownButton = e.target.closest('.product-management-dropdown-button');
      const isDropdownContent = e.target.closest('.product-management-dropdown-content');
      const isDropdownItem = e.target.closest('.product-management-dropdown-item');
      const isDropdownInput = e.target.closest('.product-management-dropdown-item-input');

      if (isDropdownContent || isDropdownItem || isDropdownInput) {
        return;
      }

      if (!dropdownContainer || (dropdownContainer && !isDropdownButton)) {
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
        // setTotalItems(response.pagination.totalItems);
        setTotalPages(response.pagination.totalPages);
        setCurrentPage(response.pagination.currentPage);

        console.log('Total products loaded:', response.products.length);
        console.log('Total pages:', response.pagination.totalPages);
        console.log('Current page:', response.pagination.currentPage);
        //console.log('Total items:', response.pagination.totalItems);
      } else {
        console.error('Invalid response format:', response);
        setProducts([]);
        //setTotalItems(0);
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
      size: product.size || '',
      price: product.price || '',
      weight: product.weight || '',
      quantity: product.quantity || '',
      discount: product.discount || '',
      summary: product.summary || '',
      isRecommended: product.isRecommended || false,
      brandId: product.brand?.brandId || '',
      categoryId: product.category?.categoryId || '',
      skinTypes: product.skinTypes?.$values?.map(skin => skin.skinTypeId) || [],
      ingredients: product.ingredients?.$values?.map(ing => ({
        ingredientId: ing.ingredientId,
        concentration: ing.concentration || ''
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

  const handleIngredientConcentrationChange = (ingredientId, concentration, isEdit = false) => {
    if (isEdit) {
      setEditedProduct(prev => ({
        ...prev,
        ingredients: prev.ingredients.map(ing =>
          ing.ingredientId === ingredientId
            ? { ...ing, concentration: concentration === '' ? '' : parseFloat(concentration) }
            : ing
        )
      }));
    } else {
      setNewProduct(prev => ({
        ...prev,
        ingredients: prev.ingredients.map(ing =>
          ing.ingredientId === ingredientId
            ? { ...ing, concentration: concentration === '' ? '' : parseFloat(concentration) }
            : ing
        )
      }));
    }
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

      // Format ingredients data
      const ingredientsData = editedProduct.ingredients.map(ing => ({
        ingredientId: parseInt(ing.ingredientId),
        concentration: ing.concentration ? parseFloat(ing.concentration) : 0
      }));

      // Format image URLs
      const imageUrls = editedProduct.images.map(img => {
        if (typeof img === 'string') return img;
        return img.url || '';
      }).filter(url => url !== '');

      const updateData = {
        productName: editedProduct.productName.trim(),
        size: editedProduct.size?.trim() || '',
        price: price,
        weight: weight,
        quantity: quantity,
        discount: discount,
        summary: editedProduct.summary?.trim() || '',
        isRecommended: Boolean(editedProduct.isRecommended),
        brandId: brandId,
        categoryId: categoryId,
        skinTypeIds: editedProduct.skinTypes.map(id => parseInt(id)),
        ingredientConcentrations: ingredientsData,
        functionIds: editedProduct.functions.map(id => parseInt(id)),
        imageUrls: imageUrls,
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
      const weight = parseFloat(newProduct.weight);
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
      if (isNaN(weight) || weight < 0) {
        throw new Error('Invalid weight');
      }
      if (isNaN(brandId) || brandId <= 0) {
        throw new Error('Please select a brand');
      }
      if (isNaN(categoryId) || categoryId <= 0) {
        throw new Error('Please select a category');
      }

      // Format ingredients data
      const ingredientsData = newProduct.ingredients.map(ing => ({
        ingredientId: parseInt(ing.ingredientId),
        concentration: ing.concentration ? parseFloat(ing.concentration) : 0
      }));

      // Format image URLs
      const imageUrls = newProduct.images.filter(url => url && url.trim() !== '');

      const productToCreate = {
        productName: newProduct.productName.trim(),
        summary: newProduct.summary?.trim() || '',
        size: newProduct.size?.trim() || '',
        price: price,
        weight: weight,
        quantity: quantity,
        discount: discount,
        isRecommended: Boolean(newProduct.isRecommended),
        brandId: brandId,
        categoryId: categoryId,
        skinTypes: newProduct.skinTypes.map(id => parseInt(id)),
        ingredients: ingredientsData,
        functions: newProduct.functions.map(id => parseInt(id)),
        images: imageUrls,
        status: true // Set default status to true for new products
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
    <div className="product-management-container">
      <div className="product-management-content">
        <div className="product-management-header">
          <div className="product-management-header-actions">
            {selectedProduct ? (
              <>
                <button onClick={handleBackToList} className="product-management-button-secondary">
                  Back to Product List
                </button>
                <h1 className="product-management-header-title">
                  Product Details: {selectedProduct.productName}
                </h1>
              </>
            ) : (
              <h1 className="product-management-header-title">Product Management</h1>
            )}
          </div>
          {!selectedProduct && (
            <button onClick={() => setShowCreateForm(true)} className="product-management-button-primary">
              Add New Product
            </button>
          )}
        </div>

        {!selectedProduct ? (
          <>
            {loading ? (
              <div className="product-management-loading">Loading data...</div>
            ) : error ? (
              <div className="product-management-error">{error}</div>
            ) : (
              <>
                <div className="product-management-table-container">
                  <table className="product-management-table">
                    <thead>
                      <tr>
                        <th className="product-management-th" style={{ width: '10%' }}>Product ID</th>
                        <th className="product-management-th" style={{ width: '25%' }}>Product Name</th>
                        <th className="product-management-th" style={{ width: '15%' }}>Price</th>
                        <th className="product-management-th" style={{ width: '10%' }}>Discount</th>
                        <th className="product-management-th" style={{ width: '10%' }}>Quantity</th>
                        <th className="product-management-th" style={{ width: '15%' }}>Image</th>
                        <th className="product-management-th" style={{ width: '15%' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr
                          key={product.productId}
                          onClick={() => handleViewDetails(product)}
                          className="product-management-table-row"
                        >
                          <td className="product-management-td">{product.productId}</td>
                          <td className="product-management-td">{product.productName}</td>
                          <td className="product-management-td">
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND'
                            }).format(product.price)}
                          </td>
                          <td className="product-management-td">{(product.discount * 100).toFixed(0)}%</td>
                          <td className="product-management-td">{product.quantity}</td>
                          <td className="product-management-td">
                            {product.productImage && (
                              <img
                                src={product.productImage}
                                alt={product.productName}
                                className="product-management-image-preview"
                              />
                            )}
                          </td>
                          <td className="product-management-td">
                            <span className={`product-management-status-badge ${product.status ? 'product-management-status-active' : 'product-management-status-inactive'}`}>
                              {product.status ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="product-management-pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`product-management-pagination-button ${currentPage === 1 ? 'product-management-pagination-button-disabled' : ''}`}
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
                            className={`product-management-pagination-button ${currentPage === pageNumber ? 'product-management-pagination-button-active' : ''}`}
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
                            className="product-management-pagination-ellipsis"
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
                      className={`product-management-pagination-button ${currentPage === totalPages ? 'product-management-pagination-button-disabled' : ''}`}
                    >
                      &gt;
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <div className="product-management-detail">
            <div className="product-management-detail-grid">
              <div>
                <h3 className="product-management-detail-title">Product Information</h3>
                <div className="product-management-detail-info">
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
                </div>
              </div>
              <div>
                <h3 className="product-management-detail-title">Category & Brand</h3>
                <div className="product-management-detail-info">
                  <div>
                    <strong>Brand:</strong> {selectedProduct.brand?.brandName}
                  </div>
                  <div>
                    <strong>Category:</strong> {selectedProduct.category?.categoryName}
                  </div>
                </div>
              </div>
            </div>

            <div className="product-management-detail-description">
              <h3 className="product-management-detail-title">Product Description</h3>
              <p>{selectedProduct.summary}</p>
            </div>

            <div className="product-management-detail-skin-types">
              <h3 className="product-management-detail-title">Skin Types</h3>
              <div className="product-management-detail-info">
                {selectedProduct.skinTypes?.$values.map(skin => (
                  <span key={skin.skinTypeId} className="product-management-skin-type">
                    {skin.skinTypeName}
                  </span>
                ))}
              </div>
            </div>

            <div className="product-management-detail-functions">
              <h3 className="product-management-detail-title">Functions</h3>
              <div className="product-management-detail-info">
                {selectedProduct.functions?.$values.map(func => (
                  <span key={func.functionId} className="product-management-function">
                    {func.functionName}
                  </span>
                ))}
              </div>
            </div>

            <div className="product-management-detail-ingredients">
              <h3 className="product-management-detail-title">Ingredients</h3>
              <table className="product-management-detail-table">
                <thead>
                  <tr>
                    <th className="product-management-th" style={{ width: '50%' }}>Ingredient Name</th>
                    <th className="product-management-th" style={{ width: '50%' }}>Concentration</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProduct.ingredients?.$values.map(ingredient => (
                    <tr key={ingredient.ingredientId}>
                      <td className="product-management-td">{ingredient.ingredientName}</td>
                      <td className="product-management-td">{ingredient.concentration}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="product-management-detail-images">
              <h3 className="product-management-detail-title">Product Images</h3>
              <div className="product-management-detail-image-grid">
                {selectedProduct.productImages?.$values.map(image => (
                  <img
                    key={image.productImageId}
                    src={image.productImage}
                    alt={selectedProduct.productName}
                    className="product-management-detail-image"
                  />
                ))}
              </div>
            </div>

            <div className="product-management-detail-actions">
              <button
                onClick={() => handleEditProduct(selectedProduct)}
                className="product-management-button-primary"
              >
                Edit Product
              </button>
              <button
                onClick={() => handleActivateProduct(selectedProduct.productId)}
                className="product-management-button-primary"
              >
                Activate Product
              </button>
              <button
                onClick={() => handleDeactivateProduct(selectedProduct.productId)}
                className="product-management-button-primary"
              >
                Deactivate Product
              </button>
            </div>
          </div>
        )}

        {showCreateForm && (
          <div className="product-management-modal">
            <div className="product-management-modal-content">
              <h2 className="product-management-modal-title">Add New Product</h2>

              <div className="product-management-form-grid">
                <div>
                  <div className="product-management-form-group">
                    <label className="product-management-label">Product Name:</label>
                    <input
                      type="text"
                      value={newProduct.productName}
                      onChange={(e) => handleNewProductChange('productName', e.target.value)}
                      className="product-management-input"
                    />
                  </div>

                  <div className="product-management-form-group">
                    <label className="product-management-label">Description:</label>
                    <textarea
                      value={newProduct.summary}
                      onChange={(e) => handleNewProductChange('summary', e.target.value)}
                      className="product-management-input"
                    />
                  </div>

                  <div className="product-management-form-group">
                    <label className="product-management-label">Size (ml):</label>
                    <input
                      type="number"
                      value={newProduct.size}
                      onChange={(e) => handleNewProductChange('size', e.target.value)}
                      min="0"
                      className="product-management-input"
                    />
                  </div>

                  <div className="product-management-form-group">
                    <label className="product-management-label">Weight (g):</label>
                    <input
                      type="number"
                      value={newProduct.weight}
                      onChange={(e) => handleNewProductChange('weight', e.target.value)}
                      min="0"
                      className="product-management-input"
                    />
                  </div>

                  <div className="product-management-form-group">
                    <label className="product-management-label">Price:</label>
                    <input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => handleNewProductChange('price', e.target.value)}
                      min="0"
                      className="product-management-input"
                    />
                  </div>

                  <div className="product-management-form-group">
                    <label className="product-management-label">Quantity:</label>
                    <input
                      type="number"
                      value={newProduct.quantity}
                      onChange={(e) => handleNewProductChange('quantity', e.target.value)}
                      min="0"
                      className="product-management-input"
                    />
                  </div>

                  <div className="product-management-form-group">
                    <label className="product-management-label">Discount:</label>
                    <div className="product-management-input-group">
                      <input
                        type="number"
                        value={newProduct.discount === '' ? '' : newProduct.discount * 100}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '') {
                            handleNewProductChange('discount', '');
                          } else {
                            const percentage = Math.min(100, Math.max(0, parseFloat(value)));
                            handleNewProductChange('discount', percentage / 100);
                          }
                        }}
                        min="0"
                        max="100"
                        step="1"
                        className="product-management-input"
                        placeholder="Enter discount percentage"
                      />
                      <span className="product-management-input-group-addon">%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="product-management-form-group">
                    <label className="product-management-label">Brand:</label>
                    <select
                      value={newProduct.brandId}
                      onChange={(e) => handleNewProductChange('brandId', e.target.value)}
                      className="product-management-input"
                    >
                      <option value="">Select Brand</option>
                      {brands.map(brand => (
                        <option key={brand.brandId} value={brand.brandId}>
                          {brand.brandName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="product-management-form-group">
                    <label className="product-management-label">Category:</label>
                    <select
                      value={newProduct.categoryId}
                      onChange={(e) => handleNewProductChange('categoryId', e.target.value)}
                      className="product-management-input"
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.categoryId} value={category.categoryId}>
                          {category.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="product-management-form-group">
                    <label className="product-management-label">Skin Types:</label>
                    <div className="product-management-dropdown-container">
                      <div
                        className="product-management-dropdown-button"
                        onClick={(e) => toggleDropdown('skinTypes', e)}
                      >
                        <div className="product-management-selected-items">
                          {newProduct.skinTypes.length > 0 ? (
                            skinTypes
                              .filter(skin => newProduct.skinTypes.includes(skin.skinTypeId))
                              .map(skin => (
                                <span key={skin.skinTypeId} className="product-management-selected-item">
                                  <span>{skin.skinTypeName}</span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleNewProductChange('skinTypes',
                                        newProduct.skinTypes.filter(id => id !== skin.skinTypeId)
                                      );
                                    }}
                                    className="product-management-remove-item"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))
                          ) : (
                            <span className="product-management-placeholder">Select Skin Types</span>
                          )}
                        </div>
                        <span>▼</span>
                      </div>
                      {dropdownStates.skinTypes && (
                        <div className="product-management-dropdown-content">
                          {skinTypes.map(skin => (
                            <div
                              key={skin.skinTypeId}
                              className="product-management-dropdown-item"
                              onClick={(e) => {
                                e.stopPropagation();
                                const isSelected = newProduct.skinTypes.includes(skin.skinTypeId);
                                handleNewProductChange('skinTypes',
                                  isSelected
                                    ? newProduct.skinTypes.filter(id => id !== skin.skinTypeId)
                                    : [...newProduct.skinTypes, skin.skinTypeId]
                                );
                              }}
                            >
                              <div className="product-management-dropdown-item-inner">
                                <input
                                  type="checkbox"
                                  checked={newProduct.skinTypes.includes(skin.skinTypeId)}
                                  onChange={() => { }}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <span>{skin.skinTypeName}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="product-management-form-group">
                    <label className="product-management-label">Functions:</label>
                    <div className="product-management-dropdown-container">
                      <div
                        className="product-management-dropdown-button"
                        onClick={(e) => toggleDropdown('functions', e)}
                      >
                        <div className="product-management-selected-items">
                          {newProduct.functions.length > 0 ? (
                            functions
                              .filter(func => newProduct.functions.includes(func.functionId))
                              .map(func => (
                                <span key={func.functionId} className="product-management-selected-item">
                                  <span>{func.functionName}</span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleNewProductChange('functions',
                                        newProduct.functions.filter(id => id !== func.functionId)
                                      );
                                    }}
                                    className="product-management-remove-item"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))
                          ) : (
                            <span className="product-management-placeholder">Select Functions</span>
                          )}
                        </div>
                        <span>▼</span>
                      </div>
                      {dropdownStates.functions && (
                        <div className="product-management-dropdown-content">
                          {functions.map(func => (
                            <div
                              key={func.functionId}
                              className="product-management-dropdown-item"
                              onClick={(e) => {
                                e.stopPropagation();
                                const isSelected = newProduct.functions.includes(func.functionId);
                                handleNewProductChange('functions',
                                  isSelected
                                    ? newProduct.functions.filter(id => id !== func.functionId)
                                    : [...newProduct.functions, func.functionId]
                                );
                              }}
                            >
                              <div className="product-management-dropdown-item-inner">
                                <input
                                  type="checkbox"
                                  checked={newProduct.functions.includes(func.functionId)}
                                  onChange={() => { }}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <span>{func.functionName}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="product-management-form-group">
                    <label className="product-management-label">Ingredients:</label>
                    <div className="product-management-dropdown-container">
                      <div
                        className="product-management-dropdown-button"
                        onClick={(e) => toggleDropdown('ingredients', e)}
                      >
                        <div className="product-management-selected-items">
                          {newProduct.ingredients.length > 0 ? (
                            ingredients
                              .filter(ing => newProduct.ingredients.some(i => i.ingredientId === ing.ingredientId))
                              .map(ing => (
                                <span key={ing.ingredientId} className="product-management-selected-item">
                                  <span>
                                    {ing.ingredientName}
                                    {newProduct.ingredients.find(i => i.ingredientId === ing.ingredientId)?.concentration !== undefined &&
                                      ` (${newProduct.ingredients.find(i => i.ingredientId === ing.ingredientId)?.concentration}%)`
                                    }
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleNewProductChange('ingredients',
                                        newProduct.ingredients.filter(i => i.ingredientId !== ing.ingredientId)
                                      );
                                    }}
                                    className="product-management-remove-item"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))
                          ) : (
                            <span className="product-management-placeholder">Select Ingredients</span>
                          )}
                        </div>
                        <span>▼</span>
                      </div>
                      {dropdownStates.ingredients && (
                        <div className="product-management-dropdown-content">
                          {ingredients.map(ing => (
                            <div
                              key={ing.ingredientId}
                              className="product-management-dropdown-item"
                            >
                              <div
                                className="product-management-dropdown-item-inner"
                                onClick={(e) => {
                                  e.stopPropagation();
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
                                  onChange={() => { }}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <span>{ing.ingredientName}</span>
                              </div>
                              {newProduct.ingredients.some(i => i.ingredientId === ing.ingredientId) && (
                                <div className="product-management-dropdown-item-input">
                                  <input
                                    type="number"
                                    value={newProduct.ingredients.find(i => i.ingredientId === ing.ingredientId)?.concentration || ''}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      handleIngredientConcentrationChange(ing.ingredientId, e.target.value);
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    placeholder="Enter %"
                                  />
                                  <span>%</span>
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

              <div className="product-management-form-group">
                <label className="product-management-label">Product Images:</label>
                <div className="product-management-image-grid">
                  {newProduct.images.map((image, index) => (
                    <div key={index} className="product-management-image-item">
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="product-management-image"
                      />
                      <button
                        onClick={() => {
                          const newImages = newProduct.images.filter((_, i) => i !== index);
                          handleNewProductChange('images', newImages);
                        }}
                        className="product-management-remove-image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <div className="product-management-image-input">
                    <input
                      type="text"
                      placeholder="Enter your URL image"
                      className="product-management-input"
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
                        const input = document.querySelector('input[placeholder="Enter your URL image"]');
                        const imageUrl = input.value.trim();
                        if (imageUrl) {
                          handleNewProductChange('images', [...newProduct.images, imageUrl]);
                          input.value = '';
                        }
                      }}
                      className="product-management-add-image"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="product-management-modal-actions">
                <button
                  onClick={handleCreateProduct}
                  className="product-management-button-primary"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Product'}
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="product-management-button-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showEditForm && (
          <div className="product-management-modal">
            <div className="product-management-modal-content">
              <h2 className="product-management-modal-title">Edit Product</h2>

              <div className="product-management-form-grid">
                <div>
                  <div className="product-management-form-group">
                    <label className="product-management-label">Product Name:</label>
                    <input
                      type="text"
                      value={editedProduct.productName}
                      onChange={(e) => setEditedProduct(prev => ({ ...prev, productName: e.target.value }))}
                      className="product-management-input"
                    />
                  </div>

                  <div className="product-management-form-group">
                    <label className="product-management-label">Description:</label>
                    <textarea
                      value={editedProduct.summary}
                      onChange={(e) => setEditedProduct(prev => ({ ...prev, summary: e.target.value }))}
                      className="product-management-input"
                    />
                  </div>

                  <div className="product-management-form-group">
                    <label className="product-management-label">Size (ml):</label>
                    <input
                      type="number"
                      value={editedProduct.size}
                      onChange={(e) => setEditedProduct(prev => ({ ...prev, size: e.target.value }))}
                      min="0"
                      className="product-management-input"
                    />
                  </div>

                  <div className="product-management-form-group">
                    <label className="product-management-label">Weight (g):</label>
                    <input
                      type="number"
                      value={editedProduct.weight}
                      onChange={(e) => setEditedProduct(prev => ({ ...prev, weight: e.target.value }))}
                      min="0"
                      className="product-management-input"
                    />
                  </div>

                  <div className="product-management-form-group">
                    <label className="product-management-label">Price:</label>
                    <input
                      type="number"
                      value={editedProduct.price}
                      onChange={(e) => setEditedProduct(prev => ({ ...prev, price: e.target.value }))}
                      min="0"
                      className="product-management-input"
                    />
                  </div>

                  <div className="product-management-form-group">
                    <label className="product-management-label">Quantity:</label>
                    <input
                      type="number"
                      value={editedProduct.quantity}
                      onChange={(e) => setEditedProduct(prev => ({ ...prev, quantity: e.target.value }))}
                      min="0"
                      className="product-management-input"
                    />
                  </div>

                  <div className="product-management-form-group">
                    <label className="product-management-label">Discount:</label>
                    <div className="product-management-input-group">
                      <input
                        type="number"
                        value={editedProduct.discount === '' ? '' : editedProduct.discount * 100}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '') {
                            setEditedProduct(prev => ({ ...prev, discount: '' }));
                          } else {
                            const percentage = Math.min(100, Math.max(0, parseFloat(value)));
                            setEditedProduct(prev => ({ ...prev, discount: percentage / 100 }));
                          }
                        }}
                        min="0"
                        max="100"
                        step="1"
                        className="product-management-input"
                        placeholder="Enter discount percentage"
                      />
                      <span className="product-management-input-group-addon">%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="product-management-form-group">
                    <label className="product-management-label">Brand:</label>
                    <select
                      value={editedProduct.brandId}
                      onChange={(e) => setEditedProduct(prev => ({ ...prev, brandId: e.target.value }))}
                      className="product-management-input"
                    >
                      <option value="">Select Brand</option>
                      {brands.map(brand => (
                        <option key={brand.brandId} value={brand.brandId}>
                          {brand.brandName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="product-management-form-group">
                    <label className="product-management-label">Category:</label>
                    <select
                      value={editedProduct.categoryId}
                      onChange={(e) => setEditedProduct(prev => ({ ...prev, categoryId: e.target.value }))}
                      className="product-management-input"
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.categoryId} value={category.categoryId}>
                          {category.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="product-management-form-group">
                    <label className="product-management-label">Skin Types:</label>
                    <div className="product-management-dropdown-container">
                      <div
                        className="product-management-dropdown-button"
                        onClick={(e) => toggleDropdown('editSkinTypes', e)}
                      >
                        <div className="product-management-selected-items">
                          {editedProduct.skinTypes.length > 0 ? (
                            skinTypes
                              .filter(skin => editedProduct.skinTypes.includes(skin.skinTypeId))
                              .map(skin => (
                                <span key={skin.skinTypeId} className="product-management-selected-item">
                                  <span>{skin.skinTypeName}</span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditedProduct(prev => ({
                                        ...prev,
                                        skinTypes: prev.skinTypes.filter(id => id !== skin.skinTypeId)
                                      }));
                                    }}
                                    className="product-management-remove-item"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))
                          ) : (
                            <span className="product-management-placeholder">Select Skin Types</span>
                          )}
                        </div>
                        <span>▼</span>
                      </div>
                      {dropdownStates.editSkinTypes && (
                        <div className="product-management-dropdown-content">
                          {skinTypes.map(skin => (
                            <div
                              key={skin.skinTypeId}
                              className="product-management-dropdown-item"
                              onClick={(e) => {
                                e.stopPropagation();
                                const isSelected = editedProduct.skinTypes.includes(skin.skinTypeId);
                                setEditedProduct(prev => ({
                                  ...prev,
                                  skinTypes: isSelected
                                    ? prev.skinTypes.filter(id => id !== skin.skinTypeId)
                                    : [...prev.skinTypes, skin.skinTypeId]
                                }));
                              }}
                            >
                              <div className="product-management-dropdown-item-inner">
                                <input
                                  type="checkbox"
                                  checked={editedProduct.skinTypes.includes(skin.skinTypeId)}
                                  onChange={(e) => { }}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <span>{skin.skinTypeName}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="product-management-form-group">
                    <label className="product-management-label">Functions:</label>
                    <div className="product-management-dropdown-container">
                      <div
                        className="product-management-dropdown-button"
                        onClick={(e) => toggleDropdown('editFunctions', e)}
                      >
                        <div className="product-management-selected-items">
                          {editedProduct.functions.length > 0 ? (
                            functions
                              .filter(func => editedProduct.functions.includes(func.functionId))
                              .map(func => (
                                <span key={func.functionId} className="product-management-selected-item">
                                  <span>{func.functionName}</span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditedProduct(prev => ({
                                        ...prev,
                                        functions: prev.functions.filter(id => id !== func.functionId)
                                      }));
                                    }}
                                    className="product-management-remove-item"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))
                          ) : (
                            <span className="product-management-placeholder">Select Functions</span>
                          )}
                        </div>
                        <span>▼</span>
                      </div>
                      {dropdownStates.editFunctions && (
                        <div className="product-management-dropdown-content">
                          {functions.map(func => (
                            <div
                              key={func.functionId}
                              className="product-management-dropdown-item"
                              onClick={(e) => {
                                e.stopPropagation();
                                const isSelected = editedProduct.functions.includes(func.functionId);
                                setEditedProduct(prev => ({
                                  ...prev,
                                  functions: isSelected
                                    ? prev.functions.filter(id => id !== func.functionId)
                                    : [...prev.functions, func.functionId]
                                }));
                              }}
                            >
                              <div className="product-management-dropdown-item-inner">
                                <input
                                  type="checkbox"
                                  checked={editedProduct.functions.includes(func.functionId)}
                                  onChange={(e) => { }}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <span>{func.functionName}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="product-management-form-group">
                    <label className="product-management-label">Ingredients:</label>
                    <div className="product-management-dropdown-container">
                      <div
                        className="product-management-dropdown-button"
                        onClick={(e) => toggleDropdown('editIngredients', e)}
                      >
                        <div className="product-management-selected-items">
                          {editedProduct.ingredients.length > 0 ? (
                            ingredients
                              .filter(ing => editedProduct.ingredients.some(i => i.ingredientId === ing.ingredientId))
                              .map(ing => (
                                <span key={ing.ingredientId} className="product-management-selected-item">
                                  <span>
                                    {ing.ingredientName}
                                    {editedProduct.ingredients.find(i => i.ingredientId === ing.ingredientId)?.concentration !== undefined &&
                                      ` (${editedProduct.ingredients.find(i => i.ingredientId === ing.ingredientId)?.concentration}%)`
                                    }
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditedProduct(prev => ({
                                        ...prev,
                                        ingredients: prev.ingredients.filter(i => i.ingredientId !== ing.ingredientId)
                                      }));
                                    }}
                                    className="product-management-remove-item"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))
                          ) : (
                            <span className="product-management-placeholder">Select Ingredients</span>
                          )}
                        </div>
                        <span>▼</span>
                      </div>
                      {dropdownStates.editIngredients && (
                        <div className="product-management-dropdown-content">
                          {ingredients.map(ing => (
                            <div
                              key={ing.ingredientId}
                              className="product-management-dropdown-item"
                            >
                              <div
                                className="product-management-dropdown-item-inner"
                                onClick={(e) => {
                                  e.stopPropagation();
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
                                  onChange={(e) => { }}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <span>{ing.ingredientName}</span>
                              </div>
                              {editedProduct.ingredients.some(i => i.ingredientId === ing.ingredientId) && (
                                <div className="product-management-dropdown-item-input">
                                  <input
                                    type="number"
                                    value={editedProduct.ingredients.find(i => i.ingredientId === ing.ingredientId)?.concentration || ''}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      handleIngredientConcentrationChange(ing.ingredientId, e.target.value, true);
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    min="0"
                                    max="100"
                                    step="0.1"
                                  />
                                  <span>%</span>
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

              <div className="product-management-form-group">
                <label className="product-management-label">Product Images:</label>
                <div className="product-management-image-grid">
                  {editedProduct.images?.map((image, index) => (
                    <div key={index} className="product-management-image-item">
                      <img
                        src={image.url || image}
                        alt={`Product ${index + 1}`}
                        className="product-management-image"
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
                        className="product-management-remove-image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <div className="product-management-image-input">
                    <input
                      type="text"
                      placeholder="Enter your URL image"
                      className="product-management-input"
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
                        const input = document.querySelector('input[placeholder="Enter your URL image"]');
                        const imageUrl = input.value.trim();
                        if (imageUrl) {
                          setEditedProduct(prev => ({
                            ...prev,
                            images: [...prev.images, imageUrl]
                          }));
                          input.value = '';
                        }
                      }}
                      className="product-management-add-image"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="product-management-modal-actions">
                <button
                  onClick={handleEditFormSubmit}
                  className="product-management-button-primary"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => setShowEditForm(false)}
                  className="product-management-button-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {notification.message && (
          <div className={`product-management-notification ${notification.type === 'success' ? 'product-management-notification-success' : 'product-management-notification-error'}`}>
            {notification.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;