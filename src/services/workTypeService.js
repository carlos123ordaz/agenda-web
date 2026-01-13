import axiosInstance from '../config/axiosConfig';

const ENDPOINT = '/work-types';

const workTypeService = {
    getAllWorkTypes: async () => {
        try {
            const response = await axiosInstance.get(ENDPOINT);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getWorkTypeByCode: async (code) => {
        try {
            const response = await axiosInstance.get(`${ENDPOINT}/${code}`);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    createWorkType: async (workTypeData) => {
        try {
            const response = await axiosInstance.post(ENDPOINT, workTypeData);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    updateWorkType: async (code, workTypeData) => {
        try {
            const response = await axiosInstance.put(`${ENDPOINT}/${code}`, workTypeData);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    deleteWorkType: async (code) => {
        try {
            const response = await axiosInstance.delete(`${ENDPOINT}/${code}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};

export default workTypeService;