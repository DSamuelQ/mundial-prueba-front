import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // tu API
});

// Interceptor para añadir token si lo usas luego
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
