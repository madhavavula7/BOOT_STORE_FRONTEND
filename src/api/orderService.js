import axios from 'axios';

const API_URL = "https://book-store-springboot.onrender.com/api/orders";

export const getMyOrders = () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        console.warn("No token found, redirecting to login...");
    }

    return axios.get(`${API_URL}/my`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};