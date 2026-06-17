import axios from 'axios';


const isDevelop = false;
export const BASE_URL = isDevelop ? 'https://stg-service.baddelha.com.sa' : 'https://service.baddelha.com.sa';
export const MEILISEARCH_URL = isDevelop ? 'https://stg-service.baddelha.com.sa/meili' : 'https://service.baddelha.com.sa/meili';
export const MEILISEARCH_KEY = isDevelop ? 'fdd97f9eff5a24a75227eb18f3f9b41dd473acddc136ac69d234ea66046a29a2' : 'fc5fe0dbd032b6bc0299be6bee5285683289bc7d85856e7a1ba8c66a901b7706';


//https://service.baddelha.com.sa/media/car/[carId]

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 100000, // 10 seconds
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from storage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.log('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      const statusCode = error?.response?.status || error?.response?.data?.statusCode;
      const message = error?.response?.data?.message || 'An error occurred';
      
      // Handle 401 Unauthorized - logout and redirect to home
      if (statusCode === 401) {
        console.warn('Unauthorized access - logging out user');
        
        // Clear all auth-related data from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('userDetails');
        
        // Dispatch event to notify components of auth state change
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('authStateChanged'));
          
          // Store the error message to show on home page
          sessionStorage.setItem('authError', message === 'Unauthorized' 
            ? 'Your session has expired. Please log in again.' 
            : message
          );
          
          // Redirect to home page
          window.location.href = '/';
        }
      }
      
      return Promise.reject(error);
    },
  );
  
export default axiosInstance;
