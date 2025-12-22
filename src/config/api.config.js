/**
 * API Configuration
 * Environment-based server configuration
 */

const getApiConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  const apiUrl = process.env.REACT_APP_API_URL || '';
  
  const configs = {
    development: {
      baseURL: apiUrl || 'http://localhost:3001/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    },
    test: {
      baseURL: apiUrl || 'http://localhost:3001/api',
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    },
    production: {
      baseURL: apiUrl || 'https://api.womenhealthplatform.com/api',
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  };

  return configs[env] || configs.development;
};

export default getApiConfig;

