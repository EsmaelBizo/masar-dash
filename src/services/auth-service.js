import axios from 'axios';
import { apiClient, HEALTH_CHECK_URL } from './api-client';

function unwrap(data) {
  return data?.value ?? data?.data ?? data;
}

function normalizeAuthResponse(data, credentials) {
  const payload = unwrap(data);
  const token =
    payload?.accessToken ||
    payload?.token ||
    payload?.access_token ||
    data?.accessToken ||
    data?.token;
  const user =
    payload?.user ||
    payload?.profile ||
    data?.user || {
      name: payload?.name || 'SAIRNA Admin',
      email: payload?.email || credentials.email,
      role: payload?.role || 'ADMIN',
    };

  return {
    token,
    portal: payload?.portal || 'dashboard',
    user: {
      ...user,
      role: user?.role || 'ADMIN',
    },
  };
}

export async function loginAdmin({ email, password }) {
  const credentials = { email, password };
  const { data } = await apiClient.post('/auth/login', credentials);
  return normalizeAuthResponse(data, credentials);
}

export async function fetchCurrentAdmin() {
  const { data } = await apiClient.get('/auth/me');
  return unwrap(data);
}

export async function fetchBackendHealth() {
  const { data } = await axios.get(HEALTH_CHECK_URL, { timeout: 8000 });
  return unwrap(data);
}
