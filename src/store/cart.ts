import type { StoreGet, StoreSet } from "../store";
import axios from "../utils/axiosConfig";

export interface CartState {
  cart: any;
}

export interface CartActions {
  addItem: (item: any) => void;
  updateQuantity: (id: any, quantity: any) => void;
  removeItem: (id: any) => void;
  clearCart: () => void;
  createOrder: ( body: any, voucher: number ) => Promise<void>;
}

export const initialCart: CartState = {
  cart: localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart") as string)
    : [],
};

const BASE_URL = "https://localhost:7130/api";

export function cartActions(set: StoreSet, get: StoreGet): CartActions {
  return {
    addItem: (item) => {
      set((state) => {
        const existingItem = state.cart.cart.find(
          (cartItem: any) => cartItem.productId === item.productId
        );
        let updatedCart;

        if (existingItem) {
          updatedCart = state.cart.cart.map((cartItem: any) =>
            cartItem.productId === item.productId
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          );
        } else {
          updatedCart = [...state.cart.cart, { ...item, quantity: 1 }];
        }

        localStorage.setItem("cart", JSON.stringify(updatedCart));
        state.cart.cart = updatedCart;
        state.notification.data.push({
          status: "SUCCESS",
          content: "Add to cart successfully!",
        });
      });
    },

    updateQuantity: (id, quantity) => {
      set((state) => {
        const updatedCart = state.cart.cart.map((item: any) =>
          item.productId === id ? { ...item, quantity } : item
        );

        localStorage.setItem("cart", JSON.stringify(updatedCart));
        state.cart.cart = updatedCart;
      });
    },

    removeItem: (id) => {
      set((state) => {
        const updatedCart = state.cart.cart.filter(
          (item: any) => item.productId !== id
        );

        localStorage.setItem("cart", JSON.stringify(updatedCart));
        state.cart.cart = updatedCart;
        state.notification.data.push({
          status: "SUCCESS",
          content: "Remote to cart successfully!",
        });
      });
    },

    clearCart: () => {
      set((state) => {
        localStorage.setItem("cart", JSON.stringify([]));
        state.cart.cart = [];
      });
    },
    createOrder: async (body,voucher) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const response = await axios.post(`${BASE_URL}/Order/create-order?voucherId=${voucher}`
          , body);
        return response.data; 
      } catch (error: any) {
        set((state) => {
          const message = error?.response?.data?.message || error?.message;
          state.profile.error = message;
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
