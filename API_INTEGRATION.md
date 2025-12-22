# API Integration Documentation

## Overview

This document describes the API integration for the Sign In functionality, including the service architecture, configuration, and testing approach.

## Architecture

### Directory Structure

```
src/
├── config/
│   ├── api.config.js          # Environment-based API configuration
│   └── README.md              # Configuration documentation
├── services/
│   └── api/
│       ├── apiClient.js       # Axios instance with interceptors
│       ├── authService.js     # Authentication API services
│       ├── index.js          # Central export point
│       ├── __tests__/        # Test files
│       │   ├── apiClient.test.js
│       │   └── authService.test.js
│       └── README.md         # Service documentation
└── pages/
    └── auth/
        ├── SignInModal.jsx    # Updated with API integration
        └── __tests__/
            └── SignInModal.test.jsx
```

## API Configuration

### Environment-Based Configuration

The API configuration is environment-aware and reads from environment variables:

- **Development**: `http://localhost:3001/api`
- **Test**: `http://localhost:3001/api`
- **Production**: `https://api.womenhealthplatform.com/api` (or via `REACT_APP_API_URL`)

### Setting Up Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:3001/api
NODE_ENV=development
```

**Note**: Environment variables must be prefixed with `REACT_APP_` to be accessible in React.

## API Client

### Features

- **Request Interceptor**: Automatically adds authentication tokens from localStorage/sessionStorage
- **Response Interceptor**: Handles common HTTP errors (401, 403, 404, 500)
- **Error Handling**: Consistent error format across all API calls
- **Token Management**: Automatic token clearing on 401 errors

### Usage

```javascript
import apiClient from './services/api/apiClient';

// Make authenticated requests
const response = await apiClient.get('/users/me');
const response = await apiClient.post('/data', { ... });
```

## Auth Service

### Available Functions

#### `signIn(credentials)`

Sign in a user with email and password.

**Parameters:**
- `credentials.email` (string): User email
- `credentials.password` (string): User password

**Returns:**
```javascript
{
  success: boolean,
  data?: {
    token: string,
    refreshToken?: string,
    user: {
      id: string,
      email: string,
      name: string
    }
  },
  error?: string,
  status?: number
}
```

**Example:**
```javascript
import { signIn } from './services/api';

const result = await signIn({
  email: 'user@example.com',
  password: 'password123'
});

if (result.success) {
  // Token is automatically stored in localStorage
  console.log('User:', result.data.user);
} else {
  console.error('Error:', result.error);
}
```

#### `signUp(userData)`

Register a new user.

**Parameters:**
- `userData.name` (string): User name
- `userData.email` (string): User email
- `userData.password` (string): User password

#### `signOut()`

Sign out the current user and clear tokens.

#### `getCurrentUser()`

Get the currently authenticated user's data.

#### `refreshToken()`

Refresh the authentication token.

## SignInModal Integration

### Features

- **API Integration**: Calls `signIn` API service on form submission
- **Loading State**: Shows loading spinner and disables form during API call
- **Error Handling**: Displays error messages from API responses
- **Token Storage**: Automatically stores tokens in localStorage
- **Success Callback**: Optional `onSignInSuccess` callback for handling successful sign-in

### Props

```javascript
<SignInModal
  isOpen={boolean}              // Controls modal visibility
  onClose={function}            // Called when modal should close
  language={string}             // Language code (default: "en")
  onSignInSuccess={function}    // Optional: Called on successful sign-in
/>
```

### Usage Example

```javascript
import SignInModal from './pages/auth/SignInModal';

function MyComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSignInSuccess = (userData) => {
    console.log('User signed in:', userData);
    // Redirect, update state, etc.
  };

  return (
    <SignInModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      language="en"
      onSignInSuccess={handleSignInSuccess}
    />
  );
}
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Test Coverage

- **API Client Tests**: Tests interceptors, error handling, and token management
- **Auth Service Tests**: Tests all authentication functions with success and error scenarios
- **SignInModal Tests**: Tests component rendering, form interactions, API integration, and error handling

### Test Files

- `src/services/api/__tests__/apiClient.test.js`
- `src/services/api/__tests__/authService.test.js`
- `src/pages/auth/__tests__/SignInModal.test.jsx`

## Error Handling

All API services return a consistent error format:

```javascript
{
  success: false,
  error: "Error message",
  status: 401  // HTTP status code
}
```

Common error scenarios:
- **401 Unauthorized**: Invalid credentials or expired token
- **403 Forbidden**: User doesn't have permission
- **404 Not Found**: Resource doesn't exist
- **500 Server Error**: Internal server error
- **Network Error**: No response from server

## Dependencies

### Added Dependencies

- **axios** (^1.7.9): HTTP client for API requests

### Existing Dependencies (for testing)

- **@testing-library/react**: React component testing
- **@testing-library/jest-dom**: DOM matchers for Jest
- **@testing-library/user-event**: User interaction simulation

## Best Practices

1. **Always check `result.success`** before accessing `result.data`
2. **Handle errors gracefully** - show user-friendly error messages
3. **Store tokens securely** - tokens are stored in localStorage (consider sessionStorage for sensitive apps)
4. **Use environment variables** for API URLs - never hardcode URLs
5. **Test API integrations** - write tests for all API service functions
6. **Handle loading states** - provide feedback during API calls

## Future Enhancements

- [ ] Add request retry logic for failed requests
- [ ] Implement token refresh on 401 errors
- [ ] Add request/response logging in development
- [ ] Add request cancellation support
- [ ] Implement request caching for GET requests
- [ ] Add rate limiting handling

## Troubleshooting

### API calls not working

1. Check that `REACT_APP_API_URL` is set correctly in `.env`
2. Restart the development server after changing `.env`
3. Verify the API server is running and accessible
4. Check browser console for CORS errors

### Tests failing

1. Ensure all dependencies are installed: `npm install`
2. Check that mocks are properly set up
3. Verify test environment configuration

### Token not being stored

1. Check browser localStorage permissions
2. Verify the API response includes a `token` field
3. Check browser console for errors

