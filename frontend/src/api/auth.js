import axios from "axios";
import { API_URL } from "../constant/constant";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        console.log("hhsh")
        const { data } = await axios.post(
          `${API_URL}/token/refresh/`,
          {},
          { withCredentials: true }
        );
        localStorage.setItem("access",data.access)
        console.log("Refreshed token:", data);
        return api(original);
      } catch (err) {
        console.error("Refresh failed", err);
        // window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
