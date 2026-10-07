import { apiClient } from './client';

export const authAPI = {
  signup: async (name, email, password) => {
    return apiClient('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  login: async (email, password) => {
    return apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  getMe: async () => {
    return apiClient('/auth/me', {
      method: 'GET',
    });
  },

  searchUsers: async (query = '') => {
    return apiClient(`/auth/search?query=${encodeURIComponent(query)}`, {
      method: 'GET',
    });
  },
};
