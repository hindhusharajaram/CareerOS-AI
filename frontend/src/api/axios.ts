import axios from 'axios';

/**
 * Resolves the primary API Base URL defensively.
 * Priority order:
 * 1. import.meta.env.VITE_API_URL (Explicit Environment Variable)
 * 2. Production fallback URL (https://careeros-ai-backend.onrender.com) if deployed live
 * 3. Local development fallback (http://localhost:8080)
 */
const getBaseUrl = (): string => {
  const envUrl = (import.meta as any).env?.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/+$/, '');
  }

  // Check if running in browser production context
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
    if (!isLocalhost) {
      // Live production fallback URL (Render Backend)
      return 'https://careeros-ai-backend.onrender.com';
    }
  }

  return 'http://localhost:8080';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT Bearer Token if present in localStorage
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

// Response interceptor: Defensive error handling for network/server connection issues
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network error, connection refused, CORS failure, or backend timeout
      const isTimeout = error.code === 'ECONNABORTED';
      const customMessage = isTimeout
        ? 'Connection timed out. The server took too long to respond.'
        : 'Cannot connect to the authorization server. Please verify backend service status.';

      error.isNetworkError = true;
      error.customUserMessage = customMessage;
    }
    return Promise.reject(error);
  }
);

export default api;
