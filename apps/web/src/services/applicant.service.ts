import axiosInstance from "@/lib/axios";
import { ApplicantStatus } from "@prisma/client";

const API_URL = '/api/applicant';

const ApplicantService = {
    getApplicantsByJob: async (jobId: string) => {
        try {
            const url = `${API_URL}/job/${jobId}`;
            console.log("ApplicantService: Sending GET request to", url);
            const response = await axiosInstance.get(url);
            console.log("ApplicantService: Received response:", response.data);
            return response.data.applicants;
        } catch (error: any) {
            console.error("ApplicantService: Error fetching applicants:", error);
            throw error.response?.data || error;
        }
    },

    getApplicantDetails: async (applicantId: string) => {
        try {
            const url = `${API_URL}/${applicantId}`;
            console.log("ApplicantService: Sending GET request to", url);
            const response = await axiosInstance.get(url);
            console.log("ApplicantService: Received response:", response.data);
            return response.data.applicant;
        } catch (error: any) {
            console.error("ApplicantService: Error fetching applicant details:", error);
            throw error.response?.data || error;
        }
    },

    updateApplicantStatus: async (
        applicantId: string,
        status: ApplicantStatus
    ) => {
        try {
            const url = `${API_URL}/${applicantId}`;
            console.log("ApplicantService: Sending PATCH request to", url, "with status:", status);
            const response = await axiosInstance.patch(
                url,
                { status }
            );
            console.log("ApplicantService: Received response:", response.data);
            return response.data.applicant;
        } catch (error: any) {
            console.error("ApplicantService: Error updating applicant status:", error);
            throw error.response?.data || error;
        }
    },

    getApplicantById: async (applicantId: string) => {
        try {
            const url = `${API_URL}/id/${applicantId}`;
            console.log("ApplicantService: Sending GET request to", url);
            const response = await axiosInstance.get(url);
            console.log("ApplicantService: Received response:", response.data);
            return response.data.applicant;
        } catch (error: any) {
            console.error("ApplicantService: Error fetching applicant by ID:", error);
            throw error.response?.data || error;
        }
    },
};

export default ApplicantService;
