import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        console.log('Token invalid or expired, executing silent auto-login retry...');
        const loginUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/auth/login';
        const res = await axios.post(loginUrl, {
          email: 'user@demo.com',
          password: 'password123'
        });
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Update the auth header and retry request
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (loginErr) {
        console.error('Silent auto-login retry failed:', loginErr);
      }
    }
    return Promise.reject(error);
  }
);

export function setSession(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

export function getUser() {
  const value = localStorage.getItem('user');
  return value ? JSON.parse(value) : null;
}

export function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
