import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true // Required for httpOnly cookies
});

// Response interceptor - only redirect to login if on an admin page
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const is401 = error.response && error.response.status === 401;
    const isAdminPage = window.location.pathname.startsWith('/admin') && 
                        window.location.pathname !== '/admin/login';

    // Only redirect to login if we're on an admin page and get a 401
    if (is401 && isAdminPage) {
      window.location.href = '/admin/login';
    }

    return Promise.reject(error);
  }
);

export default api;
