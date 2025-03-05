export interface ISubsCtg {
  id: string;
  name: string;
  price: number;
  cvGenerator: boolean;
  skillAssessment: boolean;
  priority: boolean;
  createdAt: Date;
}

export interface IPayemnt {
  id: string;
  subsDataId: string;
  subsCtgId: string;
  method: string | null;
  proof: string | null;
  isApproved: boolean | null;
  createdAt: Date;
  updatedAt: Date;
  approvalById: string | null;
  subsCtg: ISubsCtg | null;
}

export interface IUserSkill {
  id: string;
  subsDataId: string;
  skillId: string;
}

export interface IWorker {
  id: string;
  subsDataId: string;
  companyId: string;
  position: string;
  startDate: Date;
  endDate: Date | null;
  companyName: string;
  isVerified: boolean;
  description: string | null;
}

export interface ISubsData {
  id: string;
  accountId: string;
  subsCtgId: string;
  startDate: Date | null;
  endDate: Date | null;
  isSubActive: boolean;
  cvPath: string;
  createdAt: Date;
  updatedAt: Date;
  subsCtg: ISubsCtg[] | null;
  payment: IPayemnt[] | null;
  userSKill: IUserSkill[] | null;
  worker: IWorker[] | null;
}
