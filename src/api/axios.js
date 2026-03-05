// import axios from 'axios';

// const api = axios.create({
//     baseURL: 'http://localhost:8080/api', // Your Spring Boot Port
// });

// // Request Interceptor: Attach JWT to every outgoing request
// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// }, (error) => {
//     return Promise.reject(error);
// });

// export default api;

import axios from 'axios';

const api = axios.create({
    // Use Render URL if available, otherwise localhost
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
});

// Request Interceptor: Automatically adds the Bearer token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;