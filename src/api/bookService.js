import api from './axios';

export const getAllBooks = () => api.get('/books');
export const addBook = (bookData) => api.post('/books', bookData);