import CartItem from "../pages/checkout/CartItems";
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
  createOrder: (body: any, voucher: number, token: string) => Promise<void>;
  getShippingPrice: (body: any, inRegion: boolean, token: string) => Promise<any>;
}

export const initialCart: CartState = {
  cart: localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart") as string)
    : [],
};

const BASE_URL = "https://beautysc-api.purpleforest-f01817f2.southeastasia.azurecontainerapps.io/api";

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
              ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
              : cartItem
          );
        } else {
          updatedCart = [...state.cart.cart, { ...item }];
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
    createOrder: async (body, voucher, token) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const url =
          voucher && voucher > 0
            ? `${BASE_URL}/Order/create-order?voucherId=${voucher}`
            : `${BASE_URL}/Order/create-order`;
        const response = await axios.post(
          url,
          body,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (error: any) {
        set((state) => {
          const message = error?.response?.data?.detail || error?.message;
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
    getShippingPrice: async (body, inRegion, token) => {
      try {
        const url = `${BASE_URL}/Order/get_shipping_price?inRegion=${inRegion}`;
        // Giả sử API sử dụng phương thức POST với body là danh sách orderDetailRequests
        const response = await axios.post(
          url,
          body,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (error: any) {
        console.error("Error fetching shipping price:", error);
        throw error;
      }
    },

  };
}
