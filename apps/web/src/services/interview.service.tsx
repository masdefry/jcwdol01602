import axiosInstance from "@/lib/axios";

interface InterviewSchedule {
  id: string;
  applicantId: string;
  startTime: Date;
  endTime: Date;
  location: string | null;
  notes: string | null;
}

interface ApplicantSchedule {
  id: string;
  applicantId: string;
  jobId: string;
  InterviewSchedule: InterviewSchedule[] | undefined | null;
  subsData: {
    id: string;
    accounts: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
    };
    userProfilie: any; // You might want to create a more specific interface
    userEdu: any; // You might want to create a more specific interface
    userSkill: {
      id: string;
      skill: string;
    }[];
  };
}

export const fetchApplicantsByCompany = async (companyId: string): Promise<ApplicantSchedule[]> => {
  const apiUrl = `/api/interviewschedule/company/${companyId}`;
  console.log("InterviewScheduleService: Sending GET request to:", apiUrl);
  const response = await axiosInstance.get<{ applicants: ApplicantSchedule[] }>(apiUrl);
  console.log("InterviewScheduleService: Fetched schedules:", response.data.applicants);
  return response.data.applicants;
};

export const createSchedule = async (
  applicantId: string,
  startTime: Date,
  endTime: Date,
  location?: string,
  notes?: string
): Promise<InterviewSchedule> => {
  const apiUrl = `/api/interviewschedule/`;
  const response = await axiosInstance.post<{ schedule: InterviewSchedule }>(apiUrl, {
    applicantId,
    startTime,
    endTime,
    location,
    notes,
  });
  return response.data.schedule;
};

export const getSchedule = async (scheduleId: string): Promise<InterviewSchedule> => {
  const apiUrl = `/api/interviewschedule/${scheduleId}`;
  const response = await axiosInstance.get<{ schedule: InterviewSchedule }>(apiUrl);
  return response.data.schedule;
};

export const updateSchedule = async (
  scheduleId: string,
  startTime?: Date,
  endTime?: Date,
  location?: string,
  notes?: string

): Promise<InterviewSchedule> => {
  const apiUrl = `/api/interviewschedule/${scheduleId}`;
  const response = await axiosInstance.patch<{ schedule: InterviewSchedule }>(apiUrl, {
    startTime,
    endTime,
    location,
    notes,
  });
  return response.data.schedule;
};

export const deleteSchedule = async (scheduleId: string): Promise<InterviewSchedule> => {
  const apiUrl = `/api/interviewschedule/${scheduleId}`;
  const response = await axiosInstance.delete<{ schedule: InterviewSchedule }>(apiUrl);
  return response.data.schedule;
};

export const getApplicantSchedules = async (applicantId: string): Promise<InterviewSchedule[]> => {
  const apiUrl = `/api/interviewschedule/applicant/${applicantId}`;
  const response = await axiosInstance.get<{ schedules: InterviewSchedule[] }>(apiUrl);
  return response.data.schedules;
};
