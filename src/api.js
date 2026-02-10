import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/public'; // Adjust port if different

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization =`Bearer ${token}`; // Your backend expects "Bearer" + token
  }
  return config;
});

// Auth APIs matching your Spring Boot controller
export const authAPI = {

 signup: (email,username, password) =>
  api.post('/sign-up', {
     email: email,
    displayUsername: username,   
    password: password
  }),
  
 login: (email, password) =>
  api.post('/login', {
     username: email,  
      password: password
  }),
};

export default api;