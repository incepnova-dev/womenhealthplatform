# API Configuration

This directory contains environment-based API configuration for the application.

## Configuration File

`api.config.js` - Centralized API configuration that reads from environment variables.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
REACT_APP_API_URL=http://localhost:3001/api
NODE_ENV=development
```

### Environment-Specific Configuration

- **Development**: `http://localhost:3001/api`
- **Test**: `http://localhost:3001/api`
- **Production**: `https://api.womenhealthplatform.com/api` (or set via `REACT_APP_API_URL`)

## Usage

The configuration is automatically loaded by the API client. No manual import needed in most cases.

```javascript
import getApiConfig from './config/api.config';

const config = getApiConfig();
// Returns configuration based on NODE_ENV
```

## Notes

- All environment variables must be prefixed with `REACT_APP_` to be accessible in React
- Changes to `.env` require a restart of the development server
- Never commit `.env` files with sensitive data

