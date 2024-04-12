import axios from "axios";

const http = axios.create({
  baseURL: "https://api.pyra.wtf/api/v1/",
  headers: {
    accept: "application/json"
  }
});

const MAX_RETRY_ATTEMPTS = 1;
const RETRY_INTERVAL = 1000;

http.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

http.interceptors.response.use(
  (response) => {
    // return response.data;
    if (response.data.error) {
      return Promise.reject(response.data.error);
    } else {
      return response.data.message ?? response.data;
    }
  },
  (error) => {
    const { config } = error;

    const retryCount = config.retryCount || 0;
    if (retryCount < MAX_RETRY_ATTEMPTS) {
      config.retryCount = retryCount + 1;
      return new Promise((resolve) => {
        setTimeout(() => resolve(http(config)), RETRY_INTERVAL);
      });
    }

    return Promise.reject(error);
  }
);

export { http };
