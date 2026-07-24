import axios from 'axios';

const defaultBaseURL = import.meta.env.PROD
  ? `${window.location.origin}/api`
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || defaultBaseURL,
});

api.interceptors.request.use((config) => {
  try {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      const token = parsed?.token || parsed?.data?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (error) {
    console.warn('Unable to attach auth token:', error);
  }
  return config;
});

export default api;
