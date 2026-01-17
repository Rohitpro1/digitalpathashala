import axios from 'axios';
import Constants from 'expo-constants';
import { getToken } from './auth';
import { addToSyncQueue } from './sync';
import NetInfo from '@react-native-community/netinfo';

const API_URL = Constants.expoConfig.extra.apiUrl;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      // Network error - queue for offline sync
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        console.log('Offline - queuing request');
        // Add to sync queue if it's a write operation
        if (['post', 'put', 'delete'].includes(error.config.method)) {
          await addToSyncQueue(error.config);
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

// Lessons endpoints
export const lessonsAPI = {
  getAll: (params) => api.get('/lessons', { params }),
  getById: (id) => api.get(`/lessons/${id}`),
  create: (data) => api.post('/lessons', data),
};

// Digital Literacy endpoints
export const modulesAPI = {
  getAll: (params) => api.get('/digital-literacy', { params }),
  getById: (id) => api.get(`/digital-literacy/${id}`),
};

// Assignments endpoints
export const assignmentsAPI = {
  getAll: () => api.get('/assignments'),
  create: (data) => api.post('/assignments', data),
  submit: (data) => api.post('/submissions', data),
  grade: (id, marks, feedback) => 
    api.put(`/submissions/${id}/grade`, null, { params: { marks, feedback } }),
};

// Attendance endpoints
export const attendanceAPI = {
  mark: (data) => api.post('/attendance', data),
  get: (params) => api.get('/attendance', { params }),
};

// Progress endpoints
export const progressAPI = {
  update: (data) => api.post('/progress', data),
  get: (params) => api.get('/progress', { params }),
};

// Students endpoints
export const studentsAPI = {
  getAll: (params) => api.get('/students', { params }),
};

// Analytics endpoints
export const analyticsAPI = {
  getClassAnalytics: (className) => api.get(`/analytics/class/${className}`),
};

export default api;
