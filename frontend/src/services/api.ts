import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            useAuthStore.getState().logout();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;

// Auth API
export const authApi = {
    login: (email: string, password: string) =>
        api.post('/auth/login', { email, password }),
    register: (data: any) => api.post('/auth/register', data),
    getProfile: () => api.get('/auth/me'),
    logout: () => api.post('/auth/logout'),
};

// Incidents API
export const incidentsApi = {
    getAll: (params?: any) => api.get('/incidents', { params }),
    getOne: (id: string) => api.get(`/incidents/${id}`),
    create: (data: any) => api.post('/incidents', data),
    update: (id: string, data: any) => api.put(`/incidents/${id}`, data),
    delete: (id: string) => api.delete(`/incidents/${id}`),
};

// Users API
export const usersApi = {
    getAll: (params?: any) => api.get('/auth/users', { params }),
    getOne: (id: string) => api.get(`/auth/users/${id}`),
    update: (id: string, data: any) => api.put(`/auth/users/${id}`, data),
};
