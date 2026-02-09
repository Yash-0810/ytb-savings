import axios from 'axios';

// Use environment variable for API URL, default to proxy path for development
// In production, use the actual backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? 'https://ytb-savings.onrender.com/api' : '/api');

const API = axios.create({
  baseURL: API_BASE_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email: string, password: string) =>
    API.post('/auth/login', { email, password }),
  signup: (email: string, name: string, password: string) =>
    API.post('/auth/signup', { email, name, password }),
};

export const transactionAPI = {
  getAll: () => API.get('/transactions'),
  add: (data: any) => API.post('/transactions', data),
  delete: (id: string) => API.delete(`/transactions/${id}`),
  update: (id: string, data: any) => API.put(`/transactions/${id}`, data),
};

export const reportAPI = {
  getDaily: (date?: string) => API.get('/reports/daily', { params: { date } }),
  getWeekly: (date?: string) => API.get('/reports/weekly', { params: { date } }),
  getMonthly: (month?: string) => API.get('/reports/monthly', { params: { month } }),
  getAnnual: (year?: number) => API.get('/reports/annual', { params: { year } }),
};

export default API;
