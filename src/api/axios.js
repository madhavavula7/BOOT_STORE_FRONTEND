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
    // Points to your LIVE Render backend
    baseURL: 'https://book-store-springboot.onrender.com/api', 
    timeout: 60000, // Important: Gives Render 60 seconds to wake up from sleep
    headers: {
        'Content-Type': 'application/json'
    }
});

// This Interceptor automatically adds the JWT token to your headers
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;