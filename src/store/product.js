import axios from "../utils/axiosConfig";

const BASE_URL = `https://localhost:7130/api`;

export const initialProducts = {
  products: [],
  bestSellersProducts: [],
  newInProducts: [],
};

export function productsActions(set, get) {
  return {
    fetchBestSellersProducts: async () => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const response = await axios.get(
          `${BASE_URL}/Product/get-best-seller-product`
        );
        set((state) => {
          state.products.bestSellersProducts = response.data?.$values || [];
        });
      } catch (error) {
        set((state) => {
          const message = error?.response?.data?.message || error?.message;
          state.notification.data.push({
            status: "ERROR",
            content: message,
          });
        });
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },
    fetchNewInProducts: async () => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const response = await axios.get(`${BASE_URL}/Product/get-new-product`);
        set((state) => {
          state.products.bestSellersProducts = response.data?.$values || [];
        });
      } catch (error) {
        set((state) => {
          const message = error?.response?.data?.message || error?.message;
          state.notification.data.push({
            status: "ERROR",
            content: message,
          });
        });
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },
  };
}
