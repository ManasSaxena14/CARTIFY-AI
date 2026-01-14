import axiosClient from './axiosClient';

const chatAPI = {
    sendMessage: (message) => {
        return axiosClient.post('/chat/message', { message });
    },
};

export default chatAPI;
