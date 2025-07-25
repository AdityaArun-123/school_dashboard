import axios from "axios";

let isRefreshing = false; // 🛡️ Tracks if a refresh request is in progress
let failedQueue = [];     // 🗂️ Queue to hold failed requests during refresh

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const createApiInstance = (backendUrl) => {
  const api = axios.create({
    baseURL: backendUrl,
    withCredentials: true, // 🟢 So cookies are sent
  });

  api.interceptors.response.use(
    (response) => response, // ✅ Pass successful responses
    async (error) => {
      const originalRequest = error.config;
      console.log(!originalRequest._retry);

      if (error.response?.status === 401 && !originalRequest._retry) {
        const errorMsg = error.response.data?.message;

        // 🟠 Case: Access token expired
        if (
          errorMsg?.includes("Access token expired") ||
          errorMsg?.includes("Unauthorized: Invalid or expired token") ||
          errorMsg?.includes("Invalid token")
        ) {

          if (isRefreshing) {
            // ⏳ Queue the request if refresh is already in progress
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then(() => api(originalRequest)) // 🔁 Retry
              .catch(err => Promise.reject(err));
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            console.log("🔄 Attempting to refresh access token...");
            await axios.post(`${backendUrl}/auth/refresh-token`, {}, { withCredentials: true });
            console.log("✅ Refresh successful");

            processQueue(null); // ✅ Retry queued requests
            return api(originalRequest); // 🔁 Retry original failed request
          } catch (refreshError) {
            console.log("❌ Refresh failed, logging out...");
            processQueue(refreshError, null);
            window.dispatchEvent(new Event("refreshTokenFailed")); // 🚨 Notify global handler
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }

        // 🔴 Case: Not an expired token (invalid/no token)
        console.log("🚫 Authentication required, forcing logout");
        window.dispatchEvent(new Event("refreshTokenFailed"));
      }

      return Promise.reject(error);
    }
  );

  return api;
};