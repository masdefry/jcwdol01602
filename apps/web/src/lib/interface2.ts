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
