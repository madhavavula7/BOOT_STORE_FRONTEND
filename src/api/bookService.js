import api from './axios';

// Book Functions
export const getAllBooks = () => api.get('/books');
export const addBook = (bookData) => api.post('/books', bookData);

// Order Functions
export const getMyOrders = () => api.get('/orders/my');