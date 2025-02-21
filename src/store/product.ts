import type { StoreGet, StoreSet } from "../store";
import axios from "../utils/axiosConfig";

export interface Product {
  $id: string;
  productId: number;
  productName: string;
  summary: string;
  price: number;
  discount: number;
}

export interface ProductsState {
  products: Product[];
  bestSellersProducts: Product[];
  newInProducts: Product[];
}

export interface ProductsActions {
  fetchBestSellersProducts: () => Promise<void>;
  fetchNewInProducts: () => Promise<void>;
}

export const initialProducts: ProductsState = {
  products: [],
  bestSellersProducts: [],
  newInProducts: [],
};

export function productsActions(set: StoreSet, get: StoreGet): ProductsActions {
  const BASE_URL = `https://localhost:7130/api`;
  // https://localhost:7130/api/Product/get-new-product

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
      } catch (error: any) {
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
      } catch (error: any) {
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
