import axios from 'axios';

const api = axios.create({
    baseURL: 'https://book-store-springboot.onrender.com/api', 
    timeout: 60000, // Important: Gives Render 60 seconds to wake up from sleep
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;