import axios from "axios";

const API_URL = "https://beautysc-api.purpleforest-f01817f2.southeastasia.azurecontainerapps.io/api";

export const getDashboardData = async () => {
  try {
    const [revenueResponse, ordersResponse, customersResponse, productsResponse] = await Promise.all([
      axios.get(`${API_URL}/Order/get-all-revenue`),
      axios.get(`${API_URL}/Order/get-number-orders-complete`),
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

// Get revenue for a specific day
export const getRevenueByDay = async (day, month, year) => {
  try {
    const response = await axios.get(
      `${API_URL}/Order/get-revenue-by-day-mon-year?day=${day}&month=${month}&year=${year}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching daily revenue:", error);
    throw error;
  }
};

// Get revenue for a specific month
export const getRevenueByMonth = async (month, year) => {
  try {
    const response = await axios.get(
      `${API_URL}/Order/get-revenue-by-month-year?month=${month}&year=${year}`
    );
    return response.data.$values;
  } catch (error) {
    console.error("Error fetching monthly revenue:", error);
    throw error;
  }
};

// Get revenue by year range
export const getRevenueByYearRange = async (startYear, endYear) => {
  try {
    const response = await axios.get(
      `${API_URL}/Order/get-all-revuenue-by-year?startYear=${startYear}&endYear=${endYear}`
    );
    return response.data.$values;
  } catch (error) {
    console.error("Error fetching yearly revenue:", error);
    throw error;
  }
};
