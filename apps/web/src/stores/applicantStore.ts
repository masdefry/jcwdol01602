import { create } from 'zustand';
import { getApplicantsByJob } from '@/services/applicant.service';
import { Applicant } from '@/types/applicant';

interface ApplicantState {
  applicants: Applicant[];
  fetchApplicants: (jobId: string, filters?: any) => Promise<void>;
}

export const useApplicantStore = create<ApplicantState>((set) => ({
  applicants: [],
  fetchApplicants: async (jobId, filters) => {
    const data = await getApplicantsByJob(jobId, filters);
    set({ applicants: data });
  },
}));
