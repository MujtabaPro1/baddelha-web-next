import axios from 'axios';

const BASE_URL = 'https://service.baddelha.com.sa';

const serverAxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 100000, // 10 seconds
});

// No interceptors that use browser-only APIs like localStorage

export default serverAxiosInstance;


