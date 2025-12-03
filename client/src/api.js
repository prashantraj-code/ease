import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:8080/api",
  // baseURL: 'https://ease-27am.onrender.com/api',
  withCredentials: true, // send cookies
});

// Auth APIs
export const signup = (data) => API.post("/auth/signup", data);
export const login = (data) => API.post("/auth/login", data);
export const getUser = () => API.get("/auth/me");
export const logout = () => API.post("/auth/logout");

// Transaction APIs
export const getTransactions = (params) => API.get("/transactions", { params });
export const createTransaction = (data) => API.post("/transactions", data);
export const updateTransaction = (id, data) =>
  API.put(`/transactions/${id}`, data);
export const deleteTransaction = (id) => API.delete(`/transactions/${id}`);

// Reports API
export const getSummary = () => API.get("/reports/summary");

// Notifications API
export const getNotifications = () => API.get("/notifications");
