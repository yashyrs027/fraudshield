import { apiClient, USE_MOCKS } from './api';
import { MOCK_USER } from './mockData';

export const authService = {
  async login(email, password) {
    if (USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const user = { ...MOCK_USER, email };
      localStorage.setItem('fraudshield_access_token', 'mock_jwt_access_token_xyz123');
      localStorage.setItem('fraudshield_user', JSON.stringify(user));
      return { success: true, data: { user, accessToken: 'mock_jwt_access_token_xyz123' } };
    }
    const response = await apiClient.post('/auth/login', { email, password });
    if (response.data.data?.accessToken) {
      localStorage.setItem('fraudshield_access_token', response.data.data.accessToken);
      localStorage.setItem('fraudshield_user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  async register(data) {
    if (USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const newUser = {
        ...MOCK_USER,
        email: data.email,
        fullName: data.fullName,
        phoneNumber: data.phoneNumber || '+919876543210',
      };
      localStorage.setItem('fraudshield_access_token', 'mock_jwt_access_token_reg456');
      localStorage.setItem('fraudshield_user', JSON.stringify(newUser));
      return { success: true, data: { user: newUser, accessToken: 'mock_jwt_access_token_reg456' } };
    }
    const response = await apiClient.post('/auth/register', data);
    if (response.data.data?.accessToken) {
      localStorage.setItem('fraudshield_access_token', response.data.data.accessToken);
      localStorage.setItem('fraudshield_user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  async logout() {
    try {
      if (!USE_MOCKS) {
        await apiClient.post('/auth/logout');
      }
    } finally {
      localStorage.removeItem('fraudshield_access_token');
      localStorage.removeItem('fraudshield_user');
    }
    return { success: true };
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('fraudshield_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  async getProfile() {
    if (USE_MOCKS) {
      return { success: true, data: this.getCurrentUser() || MOCK_USER };
    }
    const response = await apiClient.get('/users/profile');
    return response.data;
  },

  async updatePreferences(preferences) {
    if (USE_MOCKS) {
      const user = this.getCurrentUser() || MOCK_USER;
      user.preferences = { ...user.preferences, ...preferences };
      localStorage.setItem('fraudshield_user', JSON.stringify(user));
      return { success: true, data: user.preferences };
    }
    const response = await apiClient.patch('/users/preferences', preferences);
    return response.data;
  },
};
