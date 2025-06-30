// Configuration for API endpoints
const config = {
  // Development environment
  development: {
    apiUrl: 'http://localhost:8000',
    baseUrl: 'http://localhost:3000'
  },
  // Production environment (HTTPS)
  production: {
    apiUrl: 'https://attendance-app.com/api',
    baseUrl: 'https://attendance-app.com'
  }
};

// Get current environment
const environment = process.env.NODE_ENV || 'development';

// Export the appropriate configuration
export const API_URL = config[environment].apiUrl;
export const BASE_URL = config[environment].baseUrl;

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  const baseUrl = config[environment].apiUrl;
  return `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
}; 