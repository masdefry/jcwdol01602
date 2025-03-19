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
