import axios from "axios";

export const getApplicantsByJob = async (jobId: string, filters?: any) => {
  const response = await axios.get(`/applicants/${jobId}`, { params: filters });
  return response.data;
};

export const getApplicantDetails = async (applicantId: string) => {
  const response = await axios.get(`/applicants/details/${applicantId}`);
  return response.data;
};

export const updateApplicantStatus = async (applicantId: string, status: string) => {
  const response = await axios.patch(`/applicants/${applicantId}/status`, { status });
  return response.data;
};
