export interface DobData {
  dob: number;
  accountId: string;
}

export interface GenderData {
  gender: 'male' | 'female' | null;
  accountId: string;
}

export interface LocationData {
  location: string | null;
  accountId: string;
}

export interface SalaryTrendsData {
  expectedSalary: number | null;
  jobTitle: string;
  jobLocation: string;
}

export interface ApplicantInterestsData {
  jobCategory: string;
  applicantCount: number;
}

export interface JobStatsData {
  jobId: string;
  jobTitle: string;
  applicantCount: number;
}

export interface UserCountsData {
  month: string;
  userCount: number;
}
