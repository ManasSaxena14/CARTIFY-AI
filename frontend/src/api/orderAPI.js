import axiosClient from './axiosClient';

const orderAPI = {
    createPaymentIntent: () => axiosClient.post('/orders/create-payment-intent'),
    placeOrder: (orderData) => axiosClient.post('/orders/place', orderData),
    getMyOrders: () => axiosClient.get('/orders/my'),
    getOrderById: (id) => axiosClient.get(`/orders/${id}`),
    updateOrderStatus: (orderId, status) => axiosClient.put(`/orders/${orderId}/status`, { status }),
};

export default orderAPI;
