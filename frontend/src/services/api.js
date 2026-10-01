import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
  timeout: 30000,
});

/*
 * REQUEST INTERCEPTOR
 *
 * Adds JWT automatically to every authenticated request.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("careerAI_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    /*
     * Do not force application/json when sending FormData.
     * Axios/browser will automatically create the correct
     * multipart boundary.
     */
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/*
 * RESPONSE INTERCEPTOR
 *
 * 401 = JWT is missing/expired/invalid.
 */
api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem("careerAI_token");
      localStorage.removeItem("careerAI_user");

      window.dispatchEvent(new Event("careerAI:session-expired"));
    }

    return Promise.reject(error);
  },
);

export default api;
