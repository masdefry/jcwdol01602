import axios from 'axios';

const API_URL = 'http://localhost:8000/api/job';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const fetchJobs = async (accountId: string) => {
  try {
    const url = `${API_URL}/list?accountId=${accountId}`;
    console.log("Fetching jobs from:", url);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};


// Create a new job
export const createJob = async (jobData: any) => {
  try {
    await axios.post(`${API_URL}/create`, jobData, getAuthHeaders());
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
};

// Update an existing job
export const updateJob = async (id: string, jobData: any) => {
  try {
    await axios.put(`${API_URL}/${id}`, jobData, getAuthHeaders());
  } catch (error) {
    console.error("Error updating job:", error);
    throw error;
  }
};

// Delete a job
export const deleteJob = async (id: string) => {
  try {
    await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  } catch (error) {
    console.error("Error deleting job:", error);
    throw error;
  }
};

// Toggle job publish status
export const togglePublish = async (id: string) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}/publish`, {}, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error toggling publish status:", error);
    throw error;
  }
};
