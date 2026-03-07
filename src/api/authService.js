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

// --- AUTHENTICATION ---
export const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    
    // We must reach inside: response.data (Axios) -> data (ApiResponse) -> token (AuthResponse)
    const apiResponse = response.data; 

    if (apiResponse.success && apiResponse.data) {
        const { token, role } = apiResponse.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('role', role); // Save role for navigation logic
        
        sessionStorage.removeItem('shuffled_collection');
    }
    
    return apiResponse; // Return the inner response for the component to use
};

export const register = (userData) => {
    return api.post('/auth/register', userData);
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); // Crucial: clear the role
    sessionStorage.removeItem('shuffled_collection');
    window.location.href = '/login';
};

// --- BOOKS ---
export const getAllBooks = () => api.get('/books');
export const addBook = (bookData) => api.post('/books', bookData);

// --- ORDERS ---
export const getMyOrders = () => api.get('/orders/my');