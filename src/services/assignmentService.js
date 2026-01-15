import axiosInstance from '../config/axiosConfig';

const ENDPOINT = '/assignments';

const assignmentService = {
    getAllAssignments: async (areaId) => {
        try {
            const response = await axiosInstance.get(`${ENDPOINT}/${areaId}`);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getAssignmentsByMonth: async (month, year, areaId) => {
        try {
            const response = await axiosInstance.get(`${ENDPOINT}/month/${month}/${year}/${areaId}`);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getAssignmentsByUser: async (userId) => {
        try {
            const response = await axiosInstance.get(`${ENDPOINT}/user/${userId}`);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getAssignmentsByDateRange: async (startDate, endDate) => {
        try {
            const response = await axiosInstance.post(`${ENDPOINT}/range`, {
                startDate,
                endDate,
            });
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    createAssignment: async (assignmentData) => {
        try {
            const response = await axiosInstance.post(ENDPOINT, assignmentData);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    updateAssignment: async (id, assignmentData) => {
        try {
            const response = await axiosInstance.put(`${ENDPOINT}/${id}`, assignmentData);
            return response.data.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    deleteAssignment: async (id) => {
        try {
            const response = await axiosInstance.delete(`${ENDPOINT}/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    deleteAssignmentsByUserAndMonth: async (userId, month, year) => {
        try {
            const response = await axiosInstance.delete(
                `${ENDPOINT}/user/${userId}/${month}/${year}`
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};

export default assignmentService;