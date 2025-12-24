import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://idea-share-5.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// Ideas APIs
export const ideasAPI = {
  getAll: () => api.get('/ideas'),
  getById: (id) => api.get(`/ideas/${id}`),
  create: (data) => api.post('/ideas', data),
  update: (id, data) => api.put(`/ideas/${id}`, data),
  delete: (id) => api.delete(`/ideas/${id}`),
  like: (id, data) => api.post(`/ideas/${id}/like`, data),
  comment: (id, data) => api.post(`/ideas/${id}/comment`, data),
  deleteComment: (ideaId, commentId) => api.delete(`/ideas/${ideaId}/comment/${commentId}`),
};

// Comments APIs
export const commentsAPI = {
  getByIdeaId: (ideaId) => api.get(`/comments/idea/${ideaId}`),
  create: (data) => api.post('/comments', data),
  delete: (id) => api.delete(`/comments/${id}`),
};

// Likes APIs
export const likesAPI = {
  create: (data) => api.post('/likes', data),
  delete: (id) => api.delete(`/likes/${id}`),
};

export default api;
