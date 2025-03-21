import { IWorker } from './interface';

export interface ICompReview {
  id: string;
  companyId: string;
  workerId: string;
  salary: number | null;
  culture: number | null;
  wlb: number | null;
  facility: number | null;
  career: number | null;
  description: string | null;
  worker: IWorker;
}

export interface IEmployee {
  id: string;
  subsDataId: string;
  companyId: string;
  companyName: string;
  position: string;
  startDate: Date;
  endDate: Date | null;
  description: string | null;
  isVerified: boolean;
  subsData: {
    accounts: {
      name: string;
    };
  };
}

export interface ICvData {
  id: string;
  cvPath: string;
  accountId: string;
  uploadedAt: Date;
}

export interface IJobHomePage {
  id: string;
  companyId: string;
  title: string;
  description: string;
  category: string;
  location: string;
  salaryRange: string;
  deadline: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  company: {
    id: string;
    accountId: string;
    phone: string;
    address: string | null;
    website: string | null;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    account: {
      name: string;
      avatar: string;
    };
  };
}

export interface IPaginationHomePage {
  currentPage: number;
  totalPages: number;
  totalJobs: number;
}

export interface IJobsData {
  jobs: IJobHomePage[];
  pagination: IPaginationHomePage;
}
