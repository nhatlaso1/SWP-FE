import React, { useState, useEffect } from 'react';
import { FilterAPI, callApi } from '../../store/apiFilter';
import { ProductAPI } from '../../store/apiProduct';
import { useStore } from '../../store';
import './Compare.css';

// Image Modal Component
const ImageModal = ({ image, onClose }) => {
    if (!image) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.8)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
                cursor: 'pointer'
            }}
            onClick={onClose}
        >
            <img
                src={image}
                alt="Product"
                style={{
                    maxWidth: '90%',
                    maxHeight: '90vh',
                    objectFit: 'contain',
                    borderRadius: '8px'
                }}
            />
        </div>
    );
};

const Compare = () => {
    const [products, setProducts] = useState([]);
    const [firstProduct, setFirstProduct] = useState(null);
    const [secondProduct, setSecondProduct] = useState(null);
    const [showCompare, setShowCompare] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const queryParams = {
                    pageIndex: 1,
                    pageSize: 999,
                    sortColumn: 'productId',
                    sortOrder: 'asc',
                };

                const bodyPayload = {
                    BrandIds: [],
                    Categories: [],
                    FunctionIds: [],
                    Ingredients: [],
                    SkinTypes: [],
                    MinPrice: 0,
                    MaxPrice: 999999999,
                    Status: true,
                };

                const response = await callApi('post', '/Product/get-all-product', bodyPayload, queryParams);

                let productList = [];
                if (response?.$values) {
                    productList = response.$values;
                } else if (Array.isArray(response)) {
                    productList = response;
                } else if (response?.data?.$values) {
                    productList = response.data.$values;
                }

                if (!Array.isArray(productList)) {
                    productList = [];
                }

                // Filter out inactive products
                productList = productList.filter(product => product.status === true);

                setProducts(productList);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            }
        };
        fetchProducts();
    }, []);

    // Fetch product detail when a product is selected
    const fetchProductDetail = async (productId) => {
        try {
            setLoading(true);
            setError(null);
            const productDetail = await ProductAPI.getDetail(productId);
            return productDetail;
        } catch (error) {
            console.error('Error fetching product detail:', error);
            setError('Failed to load product details');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Tính toán các sản phẩm cho trang hiện tại
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(products.length / productsPerPage);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // When a product is selected from the list
    const handleChooseFirstProduct = async (product) => {
        const productDetail = await fetchProductDetail(product.productId);
        if (productDetail) {
            setFirstProduct(productDetail);
            setSecondProduct(null);
            setShowCompare(true);
        }
    };

    // Select the second product to compare
    const handleChooseSecondProduct = async (product) => {
        if (product.productId === firstProduct?.productId) {
            alert('This product is already selected as the first product!');
            return;
        }
        const productDetail = await fetchProductDetail(product.productId);
        if (productDetail) {
            setSecondProduct(productDetail);
        }
    };

    // Return to the product list to re-select.
    const handleBack = () => {
        setShowCompare(false);
        setFirstProduct(null);
        setSecondProduct(null);
    };

    // Calculate final price after discount
    const getFinalPrice = (price, discount) => {
        if (!discount || discount <= 0) return price;
        return price * (1 - discount);
    };

    return (
        <div className="compare-container">
            <div className={`compare-panels ${showCompare ? 'show-compare' : ''}`}>
                {/* PANEL 1: Product List */}
                <div className="product-list-panel">
                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
                        All Products
                    </h2>
                    {loading ? (
                        <div className="loading-state">Loading...</div>
                    ) : error ? (
                        <div className="error-state">{error}</div>
                    ) : (
                        <div className="product-grid">
                            {currentProducts.map((product) => {
                                const hasDiscount = product.discount > 0;
                                const finalPrice = getFinalPrice(product.price, product.discount);
                                return (
                                    <div
                                        key={product.productId}
                                        className="product-card"
                                        onClick={() => handleChooseFirstProduct(product)}
                                    >
                                        <div className="product-image-container">
                                            <img
                                                src={product.productImage}
                                                alt={product.productName}
                                                className="product-image"
                                            />
                                        </div>
                                        <div className="product-info">
                                            <div>
                                                <h3 className="product-name">{product.productName}</h3>
                                                <p className="product-brand">
                                                    Brand: {product.brand?.brandName}
                                                </p>
                                            </div>
                                            <div>
                                                {hasDiscount ? (
                                                    <div className="price-container">
                                                        <span className="discounted-price">
                                                            {finalPrice.toLocaleString('en-US')} VND
                                                        </span>
                                                        <span className="original-price">
                                                            {product.price.toLocaleString('en-US')} VND
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="price-container">
                                                        <span className="discounted-price">
                                                            {product.price.toLocaleString('en-US')} VND
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {/* Pagination Controls */}
                    <div className="pagination">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="pagination-button"
                        >
                            Previous
                        </button>
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="pagination-button"
                        >
                            Next
                        </button>
                    </div>
                </div>

                {/* PANEL 2: Compare Products */}
                <div className="compare-panel">
                    <div className="compare-header">
                        <h2 style={{ textAlign: 'center', flex: 1 }}>
                            Compare Products
                        </h2>
                        <button onClick={handleBack} className="back-button">
                            Back
                        </button>
                    </div>
                    {loading ? (
                        <div className="loading-state">Loading product details...</div>
                    ) : error ? (
                        <div className="error-state">{error}</div>
                    ) : (
                        <div className="compare-products">
                            {/* First Product */}
                            <div className="product-detail-container">
                                {firstProduct ? (
                                    <ProductDetailCard product={firstProduct} />
                                ) : (
                                    <div style={{ padding: '20px', textAlign: 'center' }}>
                                        <p>No first product selected.</p>
                                    </div>
                                )}
                            </div>
                            {/* Second Product */}
                            <div className="product-detail-container">
                                {secondProduct ? (
                                    <ProductDetailCard product={secondProduct} />
                                ) : (
                                    <div style={{ padding: '20px', textAlign: 'center' }}>
                                        <p>No second product selected.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* List for selecting the second product */}
                    <div>
                        <h3 style={{ marginBottom: '15px' }}>Select Second Product:</h3>
                        <div className="second-product-grid">
                            {products.map((product) => {
                                const hasDiscount = product.discount > 0;
                                const finalPrice = getFinalPrice(product.price, product.discount);
                                return (
                                    <div
                                        key={product.productId}
                                        className="second-product-card"
                                        onClick={() => handleChooseSecondProduct(product)}
                                    >
                                        <div className="second-product-image-container">
                                            <img
                                                src={product.productImage}
                                                alt={product.productName}
                                                className="second-product-image"
                                            />
                                        </div>
                                        <div className="second-product-info">
                                            <div>
                                                <h3 className="second-product-name">{product.productName}</h3>
                                                <p className="second-product-brand">
                                                    Brand: {product.brand?.brandName}
                                                </p>
                                            </div>
                                            <div>
                                                {hasDiscount ? (
                                                    <div className="second-price-container">
                                                        <span className="second-discounted-price">
                                                            {finalPrice.toLocaleString('en-US')} VND
                                                        </span>
                                                        <span className="second-original-price">
                                                            {product.price.toLocaleString('en-US')} VND
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="second-price-container">
                                                        <span className="second-discounted-price">
                                                            {product.price.toLocaleString('en-US')} VND
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * ProductDetailCard component shows product details in a table layout along with an image section.
 */
const ProductDetailCard = ({ product }) => {
    const addItem = useStore((store) => store.addItem);

    if (!product) return null;

    const getFinalPrice = (price, discount) => {
        if (!discount || discount <= 0) return price;
        return price * (1 - discount);
    };
    const finalPrice = getFinalPrice(product.price, product.discount);
    const hasDiscount = product.discount > 0;

    return (
        <div className="detail-card">
            {/* Main Image */}
            <div className="detail-image-container">
                <div className="detail-image-wrapper">
                    <img
                        src={product.productImages?.$values[0]?.productImage}
                        alt={product.productName}
                        className="detail-image"
                    />
                </div>
            </div>

            {/* Product Info Table */}
            <div className="detail-table-container">
                <table className="detail-table">
                    <tbody>
                        {/* Basic Information */}
                        <tr className="table-section">
                            <td colSpan="2" className="section-header">Basic Information</td>
                        </tr>
                        <tr>
                            <td className="table-label">Name</td>
                            <td className="table-value">{product.productName}</td>
                        </tr>
                        <tr>
                            <td className="table-label">Brand</td>
                            <td className="table-value">{product.brand?.brandName}</td>
                        </tr>
                        <tr>
                            <td className="table-label">Category</td>
                            <td className="table-value">{product.category?.categoryName}</td>
                        </tr>
                        <tr>
                            <td className="table-label">Size</td>
                            <td className="table-value">{product.size}</td>
                        </tr>

                        {/* Price Information */}
                        <tr className="table-section">
                            <td colSpan="2" className="section-header">Price Information</td>
                        </tr>
                        <tr>
                            <td className="table-label">Current Price</td>
                            <td className="table-value price-value">
                                {finalPrice.toLocaleString()} VND
                                {hasDiscount && (
                                    <span className="discount-badge">
                                        -{(product.discount * 100)}%
                                    </span>
                                )}
                            </td>
                        </tr>
                        {hasDiscount && (
                            <tr>
                                <td className="table-label">Original Price</td>
                                <td className="table-value original-price-value">
                                    {product.price.toLocaleString()} VND
                                </td>
                            </tr>
                        )}

                        {/* Skin Types */}
                        {product.skinTypes?.$values?.length > 0 && (
                            <>
                                <tr className="table-section">
                                    <td colSpan="2" className="section-header">Suitable Skin Types</td>
                                </tr>
                                <tr>
                                    <td colSpan="2" className="table-value tag-cell">
                                        {product.skinTypes.$values.map((type) => (
                                            <span key={type.skinTypeId} className="tag tag-skin">
                                                {type.skinTypeName}
                                            </span>
                                        ))}
                                    </td>
                                </tr>
                            </>
                        )}

                        {/* Key Ingredients */}
                        {product.ingredients?.$values?.length > 0 && (
                            <>
                                <tr className="table-section">
                                    <td colSpan="2" className="section-header">Key Ingredients</td>
                                </tr>
                                <tr>
                                    <td colSpan="2" className="table-value tag-cell">
                                        {product.ingredients.$values.map((ing) => (
                                            <span key={ing.ingredientId} className="tag tag-ingredient">
                                                {ing.ingredientName}
                                                {ing.concentration && ` (${ing.concentration}%)`}
                                            </span>
                                        ))}
                                    </td>
                                </tr>
                            </>
                        )}

                        {/* Functions */}
                        {product.functions?.$values?.length > 0 && (
                            <>
                                <tr className="table-section">
                                    <td colSpan="2" className="section-header">Product Functions</td>
                                </tr>
                                <tr>
                                    <td colSpan="2" className="table-value tag-cell">
                                        {product.functions.$values.map((func) => (
                                            <span key={func.functionId} className="tag tag-function">
                                                {func.functionName}
                                            </span>
                                        ))}
                                    </td>
                                </tr>
                            </>
                        )}

                        {/* Add to Cart Button */}
                        <tr className="table-section">
                            <td colSpan="2" style={{ textAlign: 'center', padding: '20px' }}>
                                <button
                                    className="add-to-cart-btn"
                                    onClick={() => {
                                        addItem({
                                            productId: product.productId,
                                            productName: product.productName,
                                            price: finalPrice,
                                            productImage: product.productImages?.$values[0]?.productImage,
                                            category: product.category?.categoryName || "",
                                            skintype: product.skinTypes?.$values || [],
                                            quantity: 1,
                                        });
                                    }}
                                >
                                    Add to Cart
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Styles for table headers and data cells.
const tableHeaderStyle = {
    textAlign: 'left',
    padding: '8px',
    backgroundColor: '#f2f2f2',
    border: '1px solid #ddd',
    width: '35%',
};

const tableDataStyle = {
    padding: '8px',
    border: '1px solid #ddd',
};

export default Compare;
