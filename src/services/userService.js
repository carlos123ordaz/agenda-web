import axiosInstance from '../config/axiosConfig';

const ENDPOINT = '/users';

const userService = {
    getAllUsers: async () => {
        try {
            const response = await axiosInstance.get(ENDPOINT);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getUserById: async (id) => {
        try {
            const response = await axiosInstance.get(`${ENDPOINT}/${id}`);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    createUser: async (userData) => {
        try {
            const response = await axiosInstance.post(ENDPOINT, userData);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    updateUser: async (id, userData) => {
        try {
            const response = await axiosInstance.put(`${ENDPOINT}/${id}`, userData);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    deleteUser: async (id) => {
        try {
            const response = await axiosInstance.delete(`${ENDPOINT}/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};

export default userService;