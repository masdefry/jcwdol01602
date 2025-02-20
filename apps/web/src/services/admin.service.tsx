import axios from 'axios';

const API_URL = 'http://localhost:5000/jobs';

export const fetchJobs = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createJob = async (jobData: any) => {
  await axios.post(API_URL, jobData);
};

export const updateJob = async (id: string, jobData: any) => {
  await axios.put(`${API_URL}/${id}`, jobData);
};

export const deleteJob = async (id: string) => {
  await axios.delete(`${API_URL}/${id}`);
};
