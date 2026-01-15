import axiosInstance from '../config/axiosConfig';

const ENDPOINT = '/areas';

const areaService = {
    getAllAreas: async () => {
        try {
            const response = await axiosInstance.get(ENDPOINT);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getAreaById: async (id) => {
        try {
            const response = await axiosInstance.get(`${ENDPOINT}/${id}`);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    createArea: async (areaData) => {
        try {
            const response = await axiosInstance.post(ENDPOINT, areaData);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    updateArea: async (id, areaData) => {
        try {
            const response = await axiosInstance.put(`${ENDPOINT}/${id}`, areaData);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
    deleteArea: async (id) => {
        try {
            const response = await axiosInstance.delete(`${ENDPOINT}/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};

export default areaService;
