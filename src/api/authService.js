// import api from './axios';

// export const login = async (credentials) => {
//     // Matches your LoginRequest.java (email, password)
//     const response = await api.post('/auth/login', {
//         email: credentials.email, 
//         password: credentials.password
//     });
    
//     // Since AuthServiceImpl returns a raw String, response.data is the token
//     const token = typeof response.data === 'string' 
//         ? response.data 
//         : (response.data.token || response.data.jwt);
    
//     if (token) {
//         localStorage.setItem('token', token);
//     }
    
//     return response;
// };

// export const register = (userData) => {
//     return api.post('/auth/register', userData);
// };

import api from './axios';

export const login = async (credentials) => {
    // credentials = { email, password }
    const response = await api.post('/auth/login', credentials);
    
    // Extract token whether backend returns a String or an Object
    const token = typeof response.data === 'string' 
        ? response.data 
        : (response.data.token || response.data.jwt);
    
    if (token) {
        localStorage.setItem('token', token);
    }
    
    return response;
};

export const register = (userData) => {
    return api.post('/auth/register', userData);
};

export const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
};