import axios from "axios";

const API_URL = "https://beautysc-api.purpleforest-f01817f2.southeastasia.azurecontainerapps.io/api";

export const getDashboardData = async () => {
  try {
    const [revenueResponse, ordersResponse, customersResponse, productsResponse] = await Promise.all([
      axios.get(`${API_URL}/Order/get-all-revenue`),
      axios.get(`${API_URL}/Order/get-number-orders`),
      axios.get(`${API_URL}/Customer/get-number-customer`),
      axios.get(`${API_URL}/Product/get-number-of-products`)
    ]);

    return {
      revenue: revenueResponse.data,
      orders: ordersResponse.data,
      customers: customersResponse.data,
      products: productsResponse.data
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};
