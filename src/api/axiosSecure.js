import axios from "axios";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosSecure.interceptors.request.use((config) => {
  const token = localStorage.getItem("sd_jwt");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosSecure;
