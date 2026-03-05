// import api from './axios';

// export const getAllBooks = () => api.get('/books');
// export const addBook = (bookData) => api.post('/books', bookData);

import api from './axios';

// Book Functions
export const getAllBooks = () => api.get('/books');
export const addBook = (bookData) => api.post('/books', bookData);

// Order Functions (Fixed to use the interceptor)
export const getMyOrders = () => api.get('/orders/my');