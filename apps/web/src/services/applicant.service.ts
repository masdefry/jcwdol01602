import axiosInstance from '@/lib/axios';
import { Applicant, ApplicantStatus } from '@prisma/client';
import toast from 'react-hot-toast';



export const fetchApplicants = async (jobId: string): Promise<Applicant[]> => {
    try {
        const apiUrl = `/api/applicant/job/${jobId}`;
        console.log("ApplicantService: Sending GET request to:", apiUrl);
        const { data } = await axiosInstance.get(apiUrl);
        console.log("ApplicantService: Fetched applicants:", data.applicants);
        return data.applicants;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message;
        toast.dismiss();
        toast.error(errorMessage || "Failed to fetch applicants. Please try again.");
        throw new Error(errorMessage || "Failed to fetch applicants. Please try again.");
    }
};




export const fetchapplicantbyid = async (applicantId: string): Promise<Applicant[]> => {
    try {
        const apiUrl = `/api/applicant/id/${applicantId}`;
        console.log("ApplicantService: Sending GET request to:", apiUrl);
        const { data } = await axiosInstance.get(apiUrl);
        console.log("ApplicantService: Fetched applicants:", data.applicants);
        return data.applicants;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message;
        toast.dismiss();
        toast.error(errorMessage || "Failed to fetch applicants. Please try again.");
        throw new Error(errorMessage || "Failed to fetch applicants. Please try again.");
    }
};

export const updateApplicantStatus = async (
    applicantId: string,
    status: ApplicantStatus
): Promise<Applicant> => {
    try {
        const apiUrl = `/api/applicant/${applicantId}`;
        console.log("ApplicantService: Sending PATCH request to", apiUrl, "with status:", status);
        const { data } = await axiosInstance.patch(apiUrl, { status });
        console.log("ApplicantService: Received response:", data.applicant);
        toast.success('Applicant status updated successfully.');
        return data.applicant;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message;
        toast.error(errorMessage || 'Failed to update applicant status.');
        throw new Error(errorMessage || 'Failed to update applicant status.');
    }
};
