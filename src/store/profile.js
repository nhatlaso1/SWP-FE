import axios from "../utils/axiosConfig";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "https://localhost:7130/api";

export const initialProfile = {
  user: undefined,
  error: undefined,
};

export function profileActions(set, get) {
  return {
    register: async (body) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const response = await axios.post(
          `${BASE_URL}/Authentication/register`,
          body
        );
        const status = response?.data?.status;
        const message = response?.data?.detail;
        set((state) => {
          if (status === 400) {
            state.profile.error = false;
            state.notification.data.push({
              status: "ERROR",
              content: message,
            });
          } else {
            state.profile.error = message;
            state.notification.data.push({
              status: "SUCCESS",
              content: "Register successfully!",
            });
          }
        });
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
    login: async (email, password) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const response = await axios.post(`${BASE_URL}/Authentication/login`, {
          email,
          password,
        });
        const token = response.data?.token;
        const expirationTime = response.data?.expirationTime;
        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("expirationTime", expirationTime);
        }
        set((state) => {
          state.notification.data.push({
            content: "Login successfully",
            status: "SUCCESS",
          });
          if (token) {
            try {
              const decoded = jwtDecode(token);
              console.log(decoded); // { id: 1, role: "admin", iat: 1697698760 }
              state.profile.user = {
                id: decoded[
                  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid"
                ],
                email:
                  decoded[
                    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
                  ],
                role: decoded[
                  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                ],
              };
              localStorage.setItem(
                "role",
                decoded[
                  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                ]
              );
            } catch (error) {
              console.error("Invalid token:", error);
            }
          }
          state.profile.error = false;
        });
      } catch (error) {
        set((state) => {
          const message = error?.response?.data?.message || error?.message;
          state.notification.data.push({
            status: "ERROR",
            content: message,
          });
          state.profile.user = undefined;
          state.profile.error = true;
        });
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },
    logout: async () => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        set((state) => {
          localStorage.setItem("token", "");
          localStorage.setItem("role", "");
          state.profile.user = undefined;
          state.notification.data.push({
            content: "Logout successfully",
            status: "SUCCESS",
          });
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
