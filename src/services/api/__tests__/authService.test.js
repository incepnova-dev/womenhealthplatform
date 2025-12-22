/**
 * Auth Service Tests
 * Tests for authentication API service
 */

import { signIn, signUp, signOut, getCurrentUser, refreshToken } from '../authService';
import apiClient from '../apiClient';
import axios from 'axios';

// Mock axios to avoid loading the real ESM axios package
jest.mock('axios', () => ({
  __esModule: true,
  default: {
    create: jest.fn(() => ({
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
      get: jest.fn(),
      post: jest.fn(),
    })),
  },
}));

// Mock the API client
jest.mock('../apiClient');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear localStorage
    localStorage.clear();
  });

  describe('signIn', () => {
    it('should successfully sign in user with valid credentials', async () => {
      const mockResponse = {
        data: {
          token: 'mock-token-123',
          refreshToken: 'mock-refresh-token-123',
          user: {
            id: '1',
            email: 'test@example.com',
            name: 'Test User'
          }
        }
      };

      apiClient.post.mockResolvedValue(mockResponse);

      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      const result = await signIn(credentials);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResponse.data);
      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', credentials);
    });

    it('should handle sign in failure with invalid credentials', async () => {
      const mockError = {
        response: {
          status: 401,
          data: {
            message: 'Invalid email or password'
          }
        }
      };

      apiClient.post.mockRejectedValue(mockError);

      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const result = await signIn(credentials);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid email or password');
      expect(result.status).toBe(401);
    });

    it('should handle network errors', async () => {
      const mockError = {
        message: 'Network Error',
        request: {}
      };

      apiClient.post.mockRejectedValue(mockError);

      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      const result = await signIn(credentials);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network Error');
    });

    it('should handle errors without response data', async () => {
      const mockError = {
        response: {
          status: 500
        },
        message: 'Internal Server Error'
      };

      apiClient.post.mockRejectedValue(mockError);

      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      const result = await signIn(credentials);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Internal Server Error');
      expect(result.status).toBe(500);
    });
  });

  describe('signUp', () => {
    it('should successfully sign up user', async () => {
      const mockResponse = {
        data: {
          token: 'mock-token-123',
          user: {
            id: '1',
            email: 'newuser@example.com',
            name: 'New User'
          }
        }
      };

      apiClient.post.mockResolvedValue(mockResponse);

      const userData = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123'
      };

      const result = await signUp(userData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResponse.data);
      expect(apiClient.post).toHaveBeenCalledWith('/auth/signup', userData);
    });

    it('should handle sign up failure with existing email', async () => {
      const mockError = {
        response: {
          status: 409,
          data: {
            message: 'Email already exists'
          }
        }
      };

      apiClient.post.mockRejectedValue(mockError);

      const userData = {
        name: 'New User',
        email: 'existing@example.com',
        password: 'password123'
      };

      const result = await signUp(userData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email already exists');
      expect(result.status).toBe(409);
    });
  });

  describe('signOut', () => {
    it('should successfully sign out user', async () => {
      localStorage.setItem('authToken', 'mock-token');
      sessionStorage.setItem('authToken', 'mock-token');

      apiClient.post.mockResolvedValue({ data: {} });

      const result = await signOut();

      expect(result.success).toBe(true);
      expect(apiClient.post).toHaveBeenCalledWith('/auth/signout');
      expect(localStorage.getItem('authToken')).toBeNull();
      expect(sessionStorage.getItem('authToken')).toBeNull();
    });

    it('should clear tokens even if API call fails', async () => {
      localStorage.setItem('authToken', 'mock-token');
      sessionStorage.setItem('authToken', 'mock-token');

      apiClient.post.mockRejectedValue(new Error('Network Error'));

      const result = await signOut();

      expect(result.success).toBe(true);
      expect(localStorage.getItem('authToken')).toBeNull();
      expect(sessionStorage.getItem('authToken')).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('should successfully get current user', async () => {
      const mockResponse = {
        data: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User'
        }
      };

      apiClient.get.mockResolvedValue(mockResponse);

      const result = await getCurrentUser();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResponse.data);
      expect(apiClient.get).toHaveBeenCalledWith('/auth/me');
    });

    it('should handle unauthorized error', async () => {
      const mockError = {
        response: {
          status: 401,
          data: {
            message: 'Unauthorized'
          }
        }
      };

      apiClient.get.mockRejectedValue(mockError);

      const result = await getCurrentUser();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized');
      expect(result.status).toBe(401);
    });
  });

  describe('refreshToken', () => {
    it('should successfully refresh token', async () => {
      const mockResponse = {
        data: {
          token: 'new-mock-token-123',
          refreshToken: 'new-mock-refresh-token-123'
        }
      };

      apiClient.post.mockResolvedValue(mockResponse);

      const result = await refreshToken();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResponse.data);
      expect(apiClient.post).toHaveBeenCalledWith('/auth/refresh');
    });

    it('should handle refresh token failure', async () => {
      const mockError = {
        response: {
          status: 401,
          data: {
            message: 'Invalid refresh token'
          }
        }
      };

      apiClient.post.mockRejectedValue(mockError);

      const result = await refreshToken();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid refresh token');
      expect(result.status).toBe(401);
    });
  });
});

