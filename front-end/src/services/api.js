import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Retry logic for network errors
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        // Retry up to 3 times
        if (originalRequest._retryCount < 3) {
          originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
          await new Promise(resolve => setTimeout(resolve, 1000 * originalRequest._retryCount));
          return api(originalRequest);
        }
      }
    }

    return Promise.reject(error);
  }
);

export const teamService = {
  getAllTeams: () => api.get('/teams/'),
  getTeam: (id) => api.get(`/teams/${id}/`),
  createTeam: (data) => api.post('/teams/', data),
  updateTeam: (id, data) => api.put(`/teams/${id}/`, data),
  patchTeam: (id, data) => api.patch(`/teams/${id}/`, data),
  deleteTeam: (id) => api.delete(`/teams/${id}/`),
  getLeaderboard: () => api.get('/leaderboard/'),
  getStats: () => api.get('/stats/'),
};

export default api;

