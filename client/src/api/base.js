import axios from "axios";

export const baseURL = "http://localhost:5000/api/v1";

// If the server is down, e.message will hold the error instead of e.response.data.message
// to make it so the code is consistent I adjust it here.
export const applyServerDownInterceptor = (instance) => {
  instance.interceptors.response.use(
    (r) => r,
    (e) => {
      if (!e.response.data || typeof e.response.data === "string") {
        e.response.data = {
          message: e.message,
        };
      } else if (!e.response.data.message) {
        e.response.data.message = e.message;
      }
      return Promise.reject(e);
    }
  );
};
