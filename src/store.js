import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { initialLoading } from "./store/loading";
import { initialProfile, profileActions } from "./store/profile";
import { initialNotification, notificationActions } from "./store/notification";
import { initialProducts, productsActions } from "./store/product";
import { cartActions, initialCart } from "./store/cart";

export const useStore = create(
  immer((set, get) => ({
    profile: initialProfile,
    ...profileActions(set, get),
    products: initialProducts,
    ...productsActions(set, get),
    notification: initialNotification,
    ...notificationActions(set, get),
    loading: initialLoading,
    ...notificationActions(set, get),
    cart: initialCart,
    ...cartActions(set, get),
  }))
);
