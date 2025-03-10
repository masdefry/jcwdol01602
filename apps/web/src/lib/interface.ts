export interface ISubsCtg {
  id: string;
  name: string;
  price: number;
  cvGenerator: boolean;
  skillAssessment: boolean;
  priority: boolean;
  createdAt: Date;
}

export interface IUserProfile {
  id: string;
  subsDataId: string;
  gender: string;
  pob: string;
  dob: string;
  address: string;
  phoneNumber: string;
}

export interface IPayment {
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
  subsCtg: ISubsCtg | null;
  userProfile: IUserProfile;
  payment: IPayment[] | null;
  userSKill: IUserSkill[] | null;
  worker: IWorker[] | null;
}

export interface ISkill {
  id: string;
  name: string;
  createdById: string;
  createdAt: Date;
}

export interface ISkillQuestion {
  id: string;
  skillId: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  answer: string;
  imageUrl: string | null;
}

export interface IWorkerForm {
  companyName: string;
  position: string;
  beginDate: string;
  finishDate: string;
  isStillWorking: boolean;
  desc: string;
}

export interface ICompany {
  id: string;
}

export interface ICompanyData {
  name: string;
  company: ICompany;
}
