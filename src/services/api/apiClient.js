/**
 * API Client
 * Centralized HTTP client with axios
 * Handles request/response interceptors, error handling, and token management
 */

import axios from 'axios';
import getApiConfig from '../../config/api.config';

// Create axios instance with default config
const apiClient = axios.create(getApiConfig());

// Request interceptor - Add auth token if available
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage or sessionStorage
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error cases
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('authToken');
          sessionStorage.removeItem('authToken');
          // Optionally trigger a logout event or redirect
          break;
        case 403:
          // Forbidden
          console.error('Access forbidden:', data?.message || 'Forbidden');
          break;
        case 404:
          // Not found
          console.error('Resource not found:', data?.message || 'Not found');
          break;
        case 500:
          // Server error
          console.error('Server error:', data?.message || 'Internal server error');
          break;
        default:
          console.error('API error:', data?.message || error.message);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('Network error: No response received');
    } else {
      // Error setting up request
      console.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

