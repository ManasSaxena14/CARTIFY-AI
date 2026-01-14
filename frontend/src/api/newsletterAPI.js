import axiosClient from './axiosClient';

const newsletterAPI = {
    subscribe: async (email) => {
        return axiosClient.post('/support/subscribe', { email });
    }
};

export default newsletterAPI;
