import axios from 'axios';

// Request interceptor
axios.interceptors.request.use(
  config => {
    console.log('🚀 Request:', {
      method: config.method.toUpperCase(),
      url: config.url,
      data: config.data,
      headers: config.headers
    });
    return config;
  },
  error => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axios.interceptors.response.use(
  response => {
    console.log('✅ Response Details:', {
      status: response.status,
      data: response.data,
      dataType: typeof response.data,
      isArray: Array.isArray(response.data),
      headers: response.headers
    });
    return response;
  },
  error => {
    console.error('❌ Response Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      stack: error.stack
    });
    return Promise.reject(error);
  }
);

export default axios; 