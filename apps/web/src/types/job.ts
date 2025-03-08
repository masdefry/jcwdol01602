export interface Job {
  id: string;
  companyId: string;
  title: string;
  description: string;
  category: string;
  location: string;
  salaryRange?: string;
  deadline: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  applicants: Applicant[];
}

export interface Company {
  id: string;
  accountId: string;
  phone: string;
  address?: string;
  website?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Applicant {
  id: string;
  subsDataId: string;
  jobId: string;
  appliedAt: string;
  expectedSalary?: number;
  status: ApplicantStatus;
}

export enum ApplicantStatus {
  Pending = "pending",
  Interview = "interview",
  Accepted = "accepted",
  Rejected = "rejected"
}
