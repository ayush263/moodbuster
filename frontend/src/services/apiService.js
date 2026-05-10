import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (name, email, password) =>
    apiClient.post('/auth/register', { name, email, password }),
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),
  logout: () => localStorage.removeItem('token')
};

export const moodService = {
  getMoodHistory: () => apiClient.get('/moods'),
  logMood: (moodScore, context) =>
    apiClient.post('/moods', { moodScore, context }),
  getMoodStats: () => apiClient.get('/moods/stats')
};

export const recommendationService = {
  getRecommendations: () => apiClient.get('/recommendations'),
  submitFeedback: (recommendationId, helpful) =>
    apiClient.post('/recommendations/feedback', { recommendationId, helpful })
};

export const userService = {
  getProfile: () => apiClient.get('/user/profile'),
  updateProfile: (updates) => apiClient.put('/user/profile', updates)
};

export default apiClient;
