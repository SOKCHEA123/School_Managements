import axios from 'axios';

const axiosClient = axios.create({
  // ប្តូរ URL នេះបើ Backend របស់អ្នកដំណើរការលើ Port ផ្សេង ឬ Domain ផ្សេង
  baseURL: 'http://127.0.0.1:8000/api/v1', 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor សម្រាប់ភ្ជាប់ Token ទៅរាល់ Request (បន្ទាប់ពី Login រួច)
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;