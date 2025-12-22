/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import apiClient from './apiClient';

/**
 * Sign in user
 * @param {Object} credentials - User credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise<Object>} Response with user data and token
 */
export const signIn = async (credentials) => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    // Extract error message from response
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        'Sign in failed. Please try again.';
    
    return {
      success: false,
      error: errorMessage,
      status: error.response?.status,
    };
  }
};

/**
 * Sign up user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Response with user data and token
 */
export const signUp = async (userData) => {
  try {
    const response = await apiClient.post('/auth/signup', userData);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        'Sign up failed. Please try again.';
    
    return {
      success: false,
      error: errorMessage,
      status: error.response?.status,
    };
  }
};

/**
 * Sign out user
 * @returns {Promise<Object>} Response status
 */
export const signOut = async () => {
  try {
    await apiClient.post('/auth/signout');
    // Clear local storage
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    return {
      success: true,
    };
  } catch (error) {
    // Even if API call fails, clear local storage
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    return {
      success: true, // Consider it successful if we cleared local storage
    };
  }
};

/**
 * Get current user
 * @returns {Promise<Object>} Current user data
 */
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/auth/me');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Failed to fetch user data.';
    
    return {
      success: false,
      error: errorMessage,
      status: error.response?.status,
    };
  }
};

/**
 * Refresh authentication token
 * @returns {Promise<Object>} New token data
 */
export const refreshToken = async () => {
  try {
    const response = await apiClient.post('/auth/refresh');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Failed to refresh token.';
    
    return {
      success: false,
      error: errorMessage,
      status: error.response?.status,
    };
  }
};

