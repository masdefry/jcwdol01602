export interface Job {
  id: string;
  companyId: string;
  title: string;
  description: string;
  category: Categories;
  location: Locations;
  salaryRange?: string;
  deadline: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  applicants: Applicant[];
  PreSelectionTest: PreSelectionTest[];
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
  Rejected = "rejected",
}

export enum Locations {
  Jakarta = "Jakarta",
  Bandung = "Bandung",
  Surabaya = "Surabaya",
  Bali = "Bali",
  Remote = "Remote",
}

export enum Categories {
  IT = "IT",
  education = "education",
  HR = "HR",
  finance = "finance",
  healthcare = "healthcare",
  sales = "sales",
  design = "design",
}

export interface PreSelectionTest {
    id: string;
    jobId: string;
    question: string;
    options: string[];
    correctAnswer: string;
    createdAt: string;
    updatedAt: string;
}
