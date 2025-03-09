import axiosInstance from "@/lib/axios";

const API_URL = '/api/job';

const JobService = {
  createJob: async (jobData: any, accountId: string) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/create`, { ...jobData, accountId });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  updateJob: async (jobId: string, jobData: any) => {
    try {
      const response = await axiosInstance.put(`${API_URL}/${jobId}`, { ...jobData});
      console.log(response);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  deleteJob: async (jobId: string, accountId: string) => {
    try {
      const response = await axiosInstance.delete(`${API_URL}/${jobId}`, { data: { accountId } });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  getAllJobs: async (accountId: string) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/list?accountId=${accountId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  getJobDetails: async (jobId: string, accountId: string) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/${jobId}?accountId=${accountId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  togglePublish: async (jobId: string, accountId: string) => {
    try {
      const response = await axiosInstance.patch(`${API_URL}/${jobId}/publish`, { accountId });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },
};

export default JobService;
