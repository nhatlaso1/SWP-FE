import type { StoreGet, StoreSet } from "../store";
import { apiClient, apiEndpoints } from "./utils.api";

export interface ProductsState {
  products: any[];
  bestSellersProducts: any[];
  newInProducts: any[];
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
  return {
    fetchBestSellersProducts: async () => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const response = await apiClient.get(
          `${apiEndpoints.Product}/get-best-seller-product`
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
        const response = await apiClient.get(`${apiEndpoints.Product}/get-new-product`);
        console.log("New In Products:", response.data?.$values);
        set((state) => {
          state.products.newInProducts = response.data?.$values || [];
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
