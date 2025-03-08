import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Draft } from "immer";
import { initialLoading, LoadingState } from "./store/loading";
import {
  initialProfile,
  profileActions,
  ProfileActions,
  ProfileState,
} from "./store/profile";
import {
  initialUsers,
  usersActions,
  UsersActions,
  UsersState,
} from "./store/users";
import {
  initialNotification,
  NotificationActions,
  notificationActions,
  NotificationState,
} from "./store/notification";
import { CartActions, cartActions, CartState, initialCart } from "./store/cart";
import {
  initialProducts,
  ProductsActions,
  productsActions,
  ProductsState,
} from "./store/product";
import {
  initialRoutine,
  routineActions,
  RoutineActions,
  RoutineState,
} from "./store/routine";

export interface State {
  loading: LoadingState;
  notification: NotificationState;
  profile: ProfileState;
  products: ProductsState;
  users: UsersState;
  cart: CartState;
  routine: RoutineState;
}

export type Actions = ProfileActions &
  UsersActions &
  NotificationActions &
  ProductsActions &
  CartActions &
  RoutineActions;

export type Store = State & Actions;
export type StoreGet = () => Store;
export type StoreSet = (f: (state: Draft<State>) => void) => void;

export const useStore = create<Store, [["zustand/immer", never]]>(
  immer((set, get) => ({
    profile: initialProfile,
    ...profileActions(set, get),
    users: initialUsers,
    ...usersActions(set, get),
    products: initialProducts,
    ...productsActions(set, get),
    notification: initialNotification,
    ...notificationActions(set, get),
    loading: initialLoading,
    ...cartActions(set, get),
    cart: initialCart,
    ...routineActions(set, get),
    routine: initialRoutine,
  }))
);
