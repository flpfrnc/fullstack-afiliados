import axios from "axios";

// using assign over axios.interceptors to keep the implementation simple

const token = localStorage.getItem("token");

const headers = token ? { Authorization: `Bearer ${token}` } : {};

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_AXIOS_BASE_URL,
  timeout: 1000,
  headers,
});
