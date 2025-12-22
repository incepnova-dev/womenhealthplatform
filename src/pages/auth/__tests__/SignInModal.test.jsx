/**
 * SignInModal Tests
 * Tests for the SignInModal component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignInModal from '../SignInModal';
import { signIn } from '../../../services/api';

// Mock the API service
jest.mock('../../../services/api', () => ({
  signIn: jest.fn(),
}));

// Mock the language utility
jest.mock('../../../languages', () => ({
  getProperty: (key, lang) => {
    const properties = {
      'signin.title': 'Sign In',
      'signin.email.label': 'Email',
      'signin.email.placeholder': 'Enter your email',
      'signin.password.label': 'Password',
      'signin.password.placeholder': 'Enter your password',
      'signin.button.cancel': 'Cancel',
      'signin.button.submit': 'Sign In',
      'signin.button.submitting': 'Signing in...',
    };
    return properties[key] || key;
  },
}));

describe('SignInModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSignInSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should not render when isOpen is false', () => {
    render(
      <SignInModal
        isOpen={false}
        onClose={mockOnClose}
        language="en"
      />
    );

    expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(
      <SignInModal
        isOpen={true}
        onClose={mockOnClose}
        language="en"
      />
    );

    // Title is a heading
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    // Inputs can be queried by placeholder since labels are not associated via htmlFor
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
  });

  it('should update form fields when user types', async () => {
    render(
      <SignInModal
        isOpen={true}
        onClose={mockOnClose}
        language="en"
      />
    );

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('should call signIn API on form submit with correct credentials', async () => {
    signIn.mockResolvedValue({
      success: true,
      data: {
        token: 'mock-token-123',
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User'
        }
      }
    });

    render(
      <SignInModal
        isOpen={true}
        onClose={mockOnClose}
        language="en"
        onSignInSuccess={mockOnSignInSuccess}
      />
    );

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });

  it('should store token in localStorage on successful sign in', async () => {
    const mockToken = 'mock-token-123';
    signIn.mockResolvedValue({
      success: true,
      data: {
        token: mockToken,
        refreshToken: 'mock-refresh-token',
        user: {
          id: '1',
          email: 'test@example.com'
        }
      }
    });

    render(
      <SignInModal
        isOpen={true}
        onClose={mockOnClose}
        language="en"
      />
    );

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(localStorage.getItem('authToken')).toBe(mockToken);
      expect(localStorage.getItem('refreshToken')).toBe('mock-refresh-token');
    });
  });

  it('should call onSignInSuccess callback on successful sign in', async () => {
    const mockUserData = {
      token: 'mock-token-123',
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User'
      }
    };

    signIn.mockResolvedValue({
      success: true,
      data: mockUserData
    });

    render(
      <SignInModal
        isOpen={true}
        onClose={mockOnClose}
        language="en"
        onSignInSuccess={mockOnSignInSuccess}
      />
    );

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSignInSuccess).toHaveBeenCalledWith(mockUserData);
    });
  });

  it('should display error message on sign in failure', async () => {
    signIn.mockResolvedValue({
      success: false,
      error: 'Invalid email or password'
    });

    render(
      <SignInModal
        isOpen={true}
        onClose={mockOnClose}
        language="en"
      />
    );

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'wrongpassword');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });
  });

  it('should show loading state during API call', async () => {
    signIn.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({
      success: true,
      data: { token: 'mock-token' }
    }), 100)));

    render(
      <SignInModal
        isOpen={true}
        onClose={mockOnClose}
        language="en"
      />
    );

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(submitButton);

    expect(screen.getByText(/signing in/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('should clear error when user starts typing', async () => {
    signIn.mockResolvedValue({
      success: false,
      error: 'Invalid credentials'
    });

    render(
      <SignInModal
        isOpen={true}
        onClose={mockOnClose}
        language="en"
      />
    );

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    // Submit form to trigger error
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'wrongpassword');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    // Start typing to clear error
    await userEvent.type(emailInput, 'x');

    await waitFor(() => {
      expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument();
    });
  });

  it('should close modal and reset form on cancel', async () => {
    render(
      <SignInModal
        isOpen={true}
        onClose={mockOnClose}
        language="en"
      />
    );

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const cancelButton = screen.getByRole('button', { name: /cancel/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should not close modal during loading', async () => {
    signIn.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({
      success: true,
      data: { token: 'mock-token' }
    }), 100)));

    render(
      <SignInModal
        isOpen={true}
        onClose={mockOnClose}
        language="en"
      />
    );

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    const closeButton = screen.getByText('✕');

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(submitButton);

    // Try to close during loading
    await userEvent.click(closeButton);

    // Modal should not close during loading
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});

