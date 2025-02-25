import axios from "../utils/axiosConfig";

const BASE_URL = "https://localhost:7130/api";

export const initialCart = {
  cart: JSON.parse(localStorage.getItem("cart")) || [],
};

export function cartActions(set, get) {
  return {
    addItem: (item) => {
      set((state) => {
        const existingItem = state.cart.cart.find(
          (cartItem) => cartItem.productId === item.productId
        );
        let updatedCart;

        if (existingItem) {
          updatedCart = state.cart.cart.map((cartItem) =>
            cartItem.productId === item.productId
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          );
        } else {
          updatedCart = [...state.cart.cart, { ...item, quantity: 1 }];
        }

        localStorage.setItem("cart", JSON.stringify(updatedCart));
        state.cart.cart = updatedCart;
      });
    },

    updateQuantity: (id, quantity) => {
      set((state) => {
        const updatedCart = state.cart.cart.map((item) =>
          item.productId === id ? { ...item, quantity } : item
        );

        localStorage.setItem("cart", JSON.stringify(updatedCart));
        state.cart.cart = updatedCart;
      });
    },

    removeItem: (id) => {
      set((state) => {
        const updatedCart = state.cart.cart.filter(
          (item) => item.productId !== id
        );

        localStorage.setItem("cart", JSON.stringify(updatedCart));
        state.cart.cart = updatedCart;
      });
    },

    clearCart: () => {
      set((state) => {
        localStorage.setItem("cart", JSON.stringify([]));
        state.cart.cart = [];
      });
    },
    createOrder: async (body) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        await axios.post(`${BASE_URL}/Order/create-order`, body);
      } catch (error) {
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
