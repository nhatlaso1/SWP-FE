import type { StoreGet, StoreSet } from "../store";
import { NavigateFunction } from "react-router-dom";
import { apiClient, apiEndpoints } from "./utils.api";

export interface UserProfile {
  $id: string;
  customerId: number;
  fullName: string;
  birthday: string;
  skinType: {
    $id: string;
    skinTypeId: number;
    skinTypeName: string;
  };
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
  updateProfile: (values: any) => Promise<void>;
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
        const response = await apiClient.post(
          `${apiEndpoints.Authentication}/login`,
          {
            email,
            password,
          }
        );
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
        await apiClient.delete(`${apiEndpoints.Authentication}/logout`);
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
        const response = await apiClient.get(
          `${apiEndpoints.Authentication}/profile`
        );
        //Dummy data
        // const response = {
        //   data: {
        //     $id: "1",
        //     customerId: 1,
        //     fullName: "Customer 1",
        //     birthday: "1992-03-12",
        //     confirmedEmail: false,
        //     phoneNumber: "0123123213",
        //     skinType: {
        //       $id: "2",
        //       skinTypeId: 5,
        //       skinTypeName: "Dry skin",
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

    updateProfile: async (values: any) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const formData = new FormData();
        formData.append("FullName", values.fullName);
        formData.append("PhoneNumber", values.phoneNumber);
        formData.append("Birthday", values.birthday);
        formData.append("Image", "");
        await apiClient.patch(
          `${apiEndpoints.Customer}/update-profile`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
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
        const response = await apiClient.post(
          `${apiEndpoints.Authentication}/register`,
          body
        );
        set((state) => {         
          state.profile.error = undefined;
            state.notification.data.push({
              status: "SUCCESS",
              content: "Register successfully!. Please check your email to confirm your account",
            });
        });
      } catch (error: any) {
        const message =
          error?.response?.data?.detail ||
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
        await apiClient.put(`${apiEndpoints.Authentication}/refresh`);
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
        await apiClient.put(`${apiEndpoints.Customer}/change-password`, {
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
