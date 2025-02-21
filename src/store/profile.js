import axios from "../utils/axiosConfig";

const BASE_URL = "https://localhost:7130/api";

export const initialProfile = {
  user: undefined,
  error: undefined,
};

export function profileActions(set, get) {
  return {
    fetchProfile: async () => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const response = await axios.post(`${BASE_URL}/users/profile`);
        const profile = response.data?.data || undefined;
        set((state) => {
          state.profile.userProfile = profile;
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
    updateProfile: async (values) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const response = await axios.post(
          `${BASE_URL}/users/profile/update`,
          values
        );
        const profile = response.data?.data || undefined;
        set((state) => {
          // state.profile.userProfile = profile;
          state.notification.data.push({
            status: "SUCCESS",
            content: "Update profile successfully",
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
    register: async (userBody, type) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        let response;
        const body = userBody;
        if (type === "volunteer") {
          response = await axios.post(
            `${BASE_URL}/public/volunteers/register`,
            body
          );
        } else {
          response = await axios.post(`${BASE_URL}/register`, body);
        }
        const status = response?.data?.code;
        const message = response?.data?.message;
        set((state) => {
          if (status === "USER_ALREADY_EXIST") {
            state.notification.data.push({
              status: "ERROR",
              content: message,
            });
          } else {
            state.notification.data.push({
              status: "SUCCESS",
              content: "Register successfully",
            });
          }
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
    login: async (username, password) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const response = await axios.post(`${BASE_URL}/Authentication/login`, {
          username,
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
            content: response.data.message,
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
          state.profile.error = false;
          console.log(error, state.profile.error);
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
        const response = await axios.post(`${BASE_URL}/logout`);
        set((state) => {
          if (response.data.code === "LOGOUT_SUCCESS") {
            localStorage.setItem("token", "");
            localStorage.setItem("role", "");
            state.profile.user = undefined;
          }
          state.notification.data.push({
            content: response.data.message,
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
    changePassword: async (oldPassword, newPassword) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const body = {
          oldPassword: oldPassword,
          newPassword: newPassword,
          confirmPassword: newPassword,
        };
        await axios.post(`${BASE_URL}/users/changePassword`, body);
        set((state) => {
          state.notification.data.push({
            status: "SUCCESS",
            content: "Change password successfully",
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
