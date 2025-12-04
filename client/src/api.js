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

// Transaction APIs - return .data directly for easier consumption
export const getTransactions = async (params) => {
  const res = await API.get("/transactions", { params });
  return res.data;
};

export const getTransactionStats = async () => {
  const res = await API.get("/transactions/stats");
  return res.data;
};

export const createTransaction = async (data) => {
  const res = await API.post("/transactions", data);
  return res.data;
};

export const updateTransaction = async (id, data) => {
  const res = await API.put(`/transactions/${id}`, data);
  return res.data;
};

export const deleteTransaction = async (id) => {
  const res = await API.delete(`/transactions/${id}`);
  return res.data;
};

export const seedTransactions = async (count = 10) => {
  const res = await API.post("/transactions/seed", { count });
  return res.data;
};

// Money Source APIs
export const getMoneySources = async () => {
  const res = await API.get("/money-sources");
  return res.data;
};

export const createMoneySource = async (data) => {
  const res = await API.post("/money-sources", data);
  return res.data;
};

export const updateMoneySource = async (id, data) => {
  const res = await API.put(`/money-sources/${id}`, data);
  return res.data;
};

export const deleteMoneySource = async (id) => {
  const res = await API.delete(`/money-sources/${id}`);
  return res.data;
};

// People APIs
export const getPeople = async () => {
  const res = await API.get("/people");
  return res.data;
};

export const createPerson = async (data) => {
  const res = await API.post("/people", data);
  return res.data;
};

export const updatePerson = async (id, data) => {
  const res = await API.put(`/people/${id}`, data);
  return res.data;
};

export const deletePerson = async (id) => {
  const res = await API.delete(`/people/${id}`);
  return res.data;
};

// Reports API
export const getSummary = async () => {
  const res = await API.get("/reports/summary");
  return res.data;
};

// Notifications API
export const getNotifications = async () => {
  const res = await API.get("/notifications");
  return res.data;
};
