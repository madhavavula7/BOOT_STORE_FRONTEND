import axios from 'axios';

// Change this from localhost to your Render URL
const API_URL = "https://book-store-springboot.onrender.com/api/orders";

export const getMyOrders = () => {
    const token = localStorage.getItem('token');
    
    // It is good practice to check if the token exists before sending
    if (!token) {
        console.warn("No token found, redirecting to login...");
        // Handle redirect or error here
    }

    return axios.get(`${API_URL}/my`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};