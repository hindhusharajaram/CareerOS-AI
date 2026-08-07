import axios from 'axios';

const getBaseUrl = (): string => {
  const envUrl = (import.meta as any).env?.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
    if (!isLocalhost) {
      return 'https://careeros-ai-backend.onrender.com';
    }
  }

  return 'http://localhost:8080';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    if (!error.response) {
      const isTimeout = error.code === 'ECONNABORTED';
      error.customUserMessage = isTimeout
        ? 'Connection timed out while waking up server. Please try signing in again.'
        : 'Cannot connect to server. Please check your network or backend status.';
    }
    return Promise.reject(error);
  }
);

export default api;
