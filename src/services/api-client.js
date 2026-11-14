import axios from 'axios';
import { getStoredItem, removeStoredItem } from '../lib/storage';

export const DASHBOARD_TOKEN_KEY = 'masar-dashboard-token';
export const DASHBOARD_USER_KEY = 'masar-dashboard-user';

export const DASHBOARD_BASE_URL =
  import.meta.env.VITE_DASHBOARD_API_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'https://sairna.abdulrahman-hares.com/api/v1/dashboard';

export const HEALTH_CHECK_URL =
  import.meta.env.VITE_HEALTH_CHECK_URL ||
  'https://sairna.abdulrahman-hares.com/api/v1/health';

export const apiClient = axios.create({
  baseURL: DASHBOARD_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token =
    getStoredItem(DASHBOARD_TOKEN_KEY, null) ||
    getStoredItem('masar-token', null);
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeStoredItem(DASHBOARD_TOKEN_KEY);
      removeStoredItem(DASHBOARD_USER_KEY);
    }
    return Promise.reject(error);
  }
);
