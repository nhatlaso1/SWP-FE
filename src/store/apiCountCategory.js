import axios from 'axios';

const BASE_URL = 'https://localhost:7130/api';

// Tạo instance axios với cấu hình mặc định
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export const CategoryCountAPI = {
    // Hàm lấy số lượng sản phẩm cho mỗi danh mục
    getCategoriesWithCount: async () => {
        try {
            // Lấy danh sách danh mục
            const categoryResponse = await axiosInstance.get('/Category/get-categories');
            console.log('Raw category response:', categoryResponse.data);
            
            let categories = [];
            // Xử lý dữ liệu danh mục
            if (categoryResponse.data && categoryResponse.data.$values) {
                categories = categoryResponse.data.$values;
            } else if (Array.isArray(categoryResponse.data)) {
                categories = categoryResponse.data;
            }

            console.log('Processed categories:', categories);

            // Lấy tất cả sản phẩm
            const productResponse = await axiosInstance.post('/Product/get-all-product', {
                pageIndex: 1,
                pageSize: 999
            });
            console.log('Raw product response:', productResponse.data);

            let products = [];
            // Xử lý dữ liệu sản phẩm
            if (productResponse.data && productResponse.data.$values) {
                products = productResponse.data.$values;
            } else if (Array.isArray(productResponse.data)) {
                products = productResponse.data;
            } else if (productResponse.data && productResponse.data.data && productResponse.data.data.$values) {
                products = productResponse.data.data.$values;
            }

            console.log('Processed products:', products);
            
            // Log một sản phẩm mẫu để xem cấu trúc
            if (products.length > 0) {
                console.log('Sample product structure:', products[0]);
            }

            // Tạo object đếm số lượng sản phẩm cho mỗi danh mục
            const productCounts = {};
            products.forEach(product => {
                console.log('Processing product:', {
                    productId: product?.productId,
                    categoryId: product?.categoryId
                });
                
                if (product && product.categoryId) {
                    productCounts[product.categoryId] = (productCounts[product.categoryId] || 0) + 1;
                }
            });

            console.log('Product counts by category:', productCounts);

            // Kết hợp thông tin danh mục với số lượng sản phẩm
            const categoriesWithCount = categories.map(category => {
                const count = productCounts[category.categoryId] || 0;
                console.log(`Category ${category.categoryId} (${category.categoryName}) has ${count} products`);
                return {
                    ...category,
                    productCount: count
                };
            });

            console.log('Final categories with count:', categoriesWithCount);

            return categoriesWithCount;
        } catch (error) {
            console.error('Error fetching categories with count:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw error;
        }
    },

    // Hàm lấy số lượng sản phẩm cho một danh mục cụ thể
    getCountForCategory: async (categoryId) => {
        try {
            const productResponse = await axiosInstance.post('/Product/get-all-product', {
                pageIndex: 1,
                pageSize: 999
            });

            let products = [];
            if (productResponse.data && productResponse.data.$values) {
                products = productResponse.data.$values;
            } else if (Array.isArray(productResponse.data)) {
                products = productResponse.data;
            } else if (productResponse.data && productResponse.data.data && productResponse.data.data.$values) {
                products = productResponse.data.data.$values;
            }

            console.log(`Products for category ${categoryId}:`, products);

            // Đếm số sản phẩm thuộc danh mục
            const count = products.filter(product => {
                const matches = product && product.categoryId === categoryId;
                console.log(`Product ${product?.productId} category match:`, matches);
                return matches;
            }).length;

            console.log(`Total count for category ${categoryId}:`, count);
            return count;
        } catch (error) {
            console.error(`Error fetching count for category ${categoryId}:`, error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw error;
        }
    }
}; 