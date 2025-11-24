import axios from "axios";

// Determine API URL based on environment
const getApiUrl = () => {
  // Always check for environment variable first
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // In development, use localhost
  if (import.meta.env.DEV) {
    return "http://localhost:5000";
  }
  // In production, require VITE_API_URL to be set
  // This should be your Railway backend URL (e.g., https://your-app.railway.app)
  console.error("VITE_API_URL environment variable is not set in production!");
  throw new Error("API URL is not configured. Please set VITE_API_URL environment variable.");
};

const api = axios.create({
  baseURL: getApiUrl(),
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(p => error ? p.reject(error) : p.resolve(token));
  failedQueue = [];
};

api.interceptors.response.use(
  res => res,
  err => {
    const originalReq = err.config;

    if (err.response?.status === 401 && !originalReq._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
        .then(token => {
          originalReq.headers.Authorization = `Bearer ${token}`;
          return api(originalReq);
        })
        .catch(e => Promise.reject(e));
      }

      originalReq._retry = true;
      isRefreshing = true;
      const refresh = localStorage.getItem('refreshToken');

      return new Promise(async (resolve, reject) => {
        try {
          const { data } = await api.post('/auth/refresh-token', { refreshToken: refresh });
          const newToken = data.accessToken;
          localStorage.setItem('token', newToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          originalReq.headers['Authorization'] = `Bearer ${newToken}`;
          processQueue(null, newToken);
          resolve(api(originalReq));
        } catch (e) {
          processQueue(e, null);
          localStorage.clear();
          window.location.href = '/login';
          reject(e);
        } finally {
          isRefreshing = false;
        }
      });
    }

    return Promise.reject(err);
  }
);



export const authAPI = {
  login: credentials => api.post("/api/auth/login", credentials),
  register: userData => api.post("/api/auth/register", userData),
};

export default api;
