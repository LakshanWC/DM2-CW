import axios from 'axios';

const API_BASE_URL = 'http://localhost:8083/api/supplier';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getOrders = (supplierId) => api.get(`/orders/all?supplierId=${supplierId}`);
export const getPendingOrders = (supplierId) => api.get(`/orders/pending?supplierId=${supplierId}`);
export const acceptOrder = (orderDetailId, supplierId) =>
    api.post(`/orders/${orderDetailId}/accept?supplierId=${supplierId}`);

export const cancelOrder = (orderDetailId, supplierId, reason) =>
    api.post(`/orders/${orderDetailId}/cancel?supplierId=${supplierId}&reason=${encodeURIComponent(reason)}`);

export const updateOrderStatus = (orderId, supplierId, newStatus) =>
    api.put(`/orders/${orderId}/status?supplierId=${supplierId}&newStatus=${newStatus}`);

// Add response interceptor to handle errors
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            return Promise.reject(error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            return Promise.reject('No response from server');
        } else {
            // Something happened in setting up the request that triggered an Error
            return Promise.reject(error.message);
        }
    }
);

export default api;