import axios from 'axios';

const BASE_URL = 'https://stg-service.bddelha.com';

const serverAxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 100000, // 10 seconds
});

// No interceptors that use browser-only APIs like localStorage

export default serverAxiosInstance;
