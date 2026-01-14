import axiosClient from './axiosClient';

const authAPI = {
    register: (userData) => axiosClient.post('/auth/register', userData),
    login: (credentials) => axiosClient.post('/auth/login', credentials),
    logout: () => axiosClient.post('/auth/logout'),
    getMe: () => axiosClient.get('/auth/me'),
    updateProfile: (data) => axiosClient.put('/auth/update-profile', data),
    updatePassword: (data) => axiosClient.put('/auth/update-password', data),
    forgotPassword: (email) => axiosClient.post('/auth/forgot-password', { email }),
    resetPassword: (token, password) => axiosClient.put(`/auth/reset-password/${token}`, { password }),
};

export default authAPI;
