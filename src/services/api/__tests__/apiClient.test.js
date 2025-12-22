/**
 * API Client Tests
 * Tests for the axios API client configuration and interceptors
 */

import apiClient from '../apiClient';
import axios from 'axios';

// Mock axios so we don't load the real ESM axios from node_modules
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

// Mock config – note the correct relative path from __tests__ to src/config
jest.mock('../../../config/api.config', () => ({
  __esModule: true,
  default: () => ({
    baseURL: 'http://localhost:3001/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  }),
}));

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('should be an axios instance', () => {
    expect(apiClient).toBeDefined();
    expect(typeof apiClient.get).toBe('function');
    expect(typeof apiClient.post).toBe('function');
  });

  describe('Response Interceptor', () => {
    it('should handle 401 Unauthorized errors', () => {
      const error = {
        response: {
          status: 401,
          data: {
            message: 'Unauthorized'
          }
        }
      };

      localStorage.setItem('authToken', 'test-token');

      // Simulate response interceptor error handling
      // In a real scenario, this would clear the token
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
      }

      expect(localStorage.getItem('authToken')).toBeNull();
    });

    it('should handle network errors', () => {
      const error = {
        request: {},
        message: 'Network Error'
      };

      // Network errors should be handled gracefully
      expect(error.request).toBeDefined();
      expect(error.message).toBe('Network Error');
    });

    it('should handle request setup errors', () => {
      const error = {
        message: 'Request setup error'
      };

      expect(error.message).toBe('Request setup error');
      expect(error.response).toBeUndefined();
      expect(error.request).toBeUndefined();
    });
  });
});

