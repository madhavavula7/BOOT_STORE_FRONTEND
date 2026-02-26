import axios from 'axios';

const API_URL = "http://localhost:8080/api/orders";

export const getMyOrders = () => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_URL}/my`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};