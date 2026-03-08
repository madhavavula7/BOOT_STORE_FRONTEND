import api from './axios';

export const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const apiResponse = response.data; 

    if (apiResponse.success && apiResponse.data) {
        const { token, role } = apiResponse.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        
        sessionStorage.removeItem('shuffled_collection');
    }
    
    return apiResponse;
};

export const register = (userData) => {
    return api.post('/auth/register', userData);
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    sessionStorage.removeItem('shuffled_collection');
    window.location.href = '/login';
};

// Books
export const getAllBooks = () => api.get('/books');
export const addBook = (bookData) => api.post('/books', bookData);

// Orders
export const getMyOrders = () => api.get('/orders/my');

export const registerAdmin = (adminData) => {
    return api.post('/auth/register-admin', adminData);
};