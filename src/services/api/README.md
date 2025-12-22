# API Services

This directory contains all API-related services and utilities.

## Structure

```
api/
├── apiClient.js       # Axios instance with interceptors
├── authService.js     # Authentication API calls
├── index.js          # Central export point
└── __tests__/        # Test files
    ├── apiClient.test.js
    └── authService.test.js
```

## API Client

`apiClient.js` provides a configured axios instance with:
- Request interceptors for adding authentication tokens
- Response interceptors for handling common errors
- Automatic token management

## Auth Service

`authService.js` provides authentication-related API functions:
- `signIn(credentials)` - Sign in user
- `signUp(userData)` - Sign up new user
- `signOut()` - Sign out user
- `getCurrentUser()` - Get current user data
- `refreshToken()` - Refresh authentication token

## Usage

```javascript
import { signIn, signUp } from '../services/api';

// Sign in
const result = await signIn({
  email: 'user@example.com',
  password: 'password123'
});

if (result.success) {
  // Handle success
  console.log(result.data);
} else {
  // Handle error
  console.error(result.error);
}
```

## Error Handling

All service functions return a consistent response format:

```javascript
{
  success: boolean,
  data?: any,        // Present on success
  error?: string,   // Present on failure
  status?: number    // HTTP status code (on failure)
}
```

## Testing

Run tests with:
```bash
npm test
```

Test files are located in `__tests__/` directory.

