import type { StoreGet, StoreSet } from "../store";
import axios from "../utils/axiosConfig";
import { NavigateFunction } from "react-router-dom";

export interface UserProfile {
  $id: string;
  customerId: number;
  accountId: number;
  fullName: string;
  birthday: string;
  phoneNumber: string;
  confirmedEmail: boolean;
  status: boolean;
  skinTypeId: number;
  account: Account;
  feedbacks: RefreshTokens;
  orders: RefreshTokens;
  shippingAddresses: RefreshTokens;
}

export interface Account {
  $id: string;
  accountId: number;
  email: string;
  password: string;
  role: string;
  customer: Customer;
  refreshTokens: RefreshTokens;
}

export interface RefreshTokens {
  $id: string;
  $values: any[];
}

export interface Customer {
  $ref: string;
}

export interface User {
  role: string;
  token: string;
  email: string;
}

export interface ProfileState {
  user: User | undefined;
  userProfile: UserProfile | undefined;
  error: string | undefined;
}

export interface ProfileActions {
  fetchProfile: () => Promise<void>;
  updateProfile: (values: Record<string, unknown>) => Promise<void>;
  register: (userBody: Record<string, unknown>) => Promise<void>;
  login: (
    email: string,
    password: string,
    navigate: NavigateFunction
  ) => Promise<void>;
  logout: (navigate: NavigateFunction) => Promise<void>;
  refreshToken: () => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  setError: (error: string | undefined) => void;
}

export const initialProfile: ProfileState = {
  user: undefined,
  userProfile: undefined,
  error: undefined,
};

const BASE_URL = "https://localhost:7130/api/Authentication";

export function profileActions(set: StoreSet, get: StoreGet): ProfileActions {
  const handleError = (error: any) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "An unexpected error occurred";
    set((state) => {
      state.profile.error = message;
      state.notification.data.push({
        status: "ERROR",
        content: message,
      });
    });
  };

  const handleSuccess = (message: string) => {
    set((state) => {
      state.notification.data.push({
        status: "SUCCESS",
        content: message,
      });
    });
  };

  return {
    login: async (email, password, navigate) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const response = await axios.post(`${BASE_URL}/login`, {
          email,
          password,
        });
        const { token } = response.data || {};

        if (token) {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const role =
            payload[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ];

          set((state) => {
            state.profile.user = { email, token, role };
          });

          localStorage.setItem("token", token);
          localStorage.setItem("role", role);

          handleSuccess("Login successful");
        } else {
          throw new Error("Invalid token received");
        }
      } catch (error) {
        handleError(error);
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },

    logout: async (navigate) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        await axios.delete(`${BASE_URL}/logout`);
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        set((state) => {
          state.profile.user = undefined;
        });

        navigate("/login"); // Chuyển hướng về login page
        handleSuccess("Logout successful");
      } catch (error) {
        handleError(error);
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },

    fetchProfile: async () => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const response = await axios.get(`${BASE_URL}/Authentication/profile`);
        //Dummy data
        // const response = {
        //   data: {
        //     $id: "1",
        //     customerId: 1,
        //     accountId: 1,
        //     fullName: "nhat vu minh",
        //     birthday: "2001-01-01",
        //     phoneNumber: "+84332338587",
        //     confirmedEmail: false,
        //     status: true,
        //     skinTypeId: 1,
        //     account: {
        //       $id: "2",
        //       accountId: 1,
        //       email: "customer1@example.com",
        //       password:
        //         "$2a$11$wtFq3R/acjsYL.k8CXT9nO1alaldf/yWdqOk/x80W9s6fcqPbo6Nu",
        //       role: "Customer",
        //       customer: {
        //         $ref: "1",
        //       },
        //       refreshTokens: {
        //         $id: "3",
        //         $values: [],
        //       },
        //     },
        //     feedbacks: {
        //       $id: "4",
        //       $values: [],
        //     },
        //     orders: {
        //       $id: "5",
        //       $values: [],
        //     },
        //     shippingAddresses: {
        //       $id: "6",
        //       $values: [],
        //     },
        //   },
        // };
        set((state) => {
          console.log(response);
          state.profile.userProfile = response.data || undefined;
        });
        handleSuccess("Profile fetched successfully");
      } catch (error) {
        handleError(error);
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },

    updateProfile: async (values) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        await axios.put(`${BASE_URL}/profile`, values);
        handleSuccess("Profile updated successfully");
      } catch (error) {
        handleError(error);
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },

    register: async (body) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const response = await axios.post(`${BASE_URL}/register`, body);
        const status = response?.data?.status;
        const message = response?.data?.detail || "Register successfully!";
        set((state) => {
          if (status === 400) {
            state.profile.error = message; // Chắc chắn error luôn là string hoặc undefined
            state.notification.data.push({
              status: "ERROR",
              content: message,
            });
          } else {
            state.profile.error = undefined;
            state.notification.data.push({
              status: "SUCCESS",
              content: "Register successfully!",
            });
          }
        });
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "An unexpected error occurred";
        set((state) => {
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
    refreshToken: async () => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        await axios.put(`${BASE_URL}/refresh`);
        handleSuccess("Token refreshed successfully");
      } catch (error) {
        handleError(error);
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },

    changePassword: async (oldPassword, newPassword) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        await axios.put(`${BASE_URL}/change-password`, {
          oldPassword,
          newPassword,
        });
        handleSuccess("Password changed successfully");
      } catch (error) {
        handleError(error);
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },

    setError: (error) => {
      set((state) => {
        state.profile.error = error;
      });
    },
  };
}
