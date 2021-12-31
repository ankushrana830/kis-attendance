import axios from "axios";
import { API_BASE_URL } from "../environment";

export const getAccessToken = () => {
  const tokens = localStorage.getItem("tokens");
  if (tokens) {
    const tokenData = JSON.parse(tokens);
    return `${tokenData.access.token}`;
  }
  return null;
};

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
});

httpClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    // config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    console.log(error);
    Promise.reject(error);
  }
);
