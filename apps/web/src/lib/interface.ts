import { ICvData } from './interface2';

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
  skill: ISkill;
  skillScore: ISkillScore[];
}

export interface IWorker {
  id: string;
  subsDataId: string;
  companyId: string;
  companyName: string;
  position: string;
  startDate: Date;
  endDate: Date | null;
  description: string | null;
  isVerified: boolean;
}

export interface IUserEdu {
  id: string;
  subsDataId: string;
  level: string;
  school: string;
  discipline: string;
  startDate: Date;
  endDate: Date | null;
  description: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface ISubsData {
  id: string;
  accountId: string;
  subsCtgId: string;
  startDate: Date | null;
  endDate: Date | null;
  isSubActive: boolean;
  cvId: string;
  createdAt: Date;
  updatedAt: Date;
  subsCtg: ISubsCtg | null;
  userProfile: IUserProfile;
  payment: IPayment[] | [];
  userSkill: IUserSkill[] | [];
  worker: IWorker[] | [];
  userEdu: IUserEdu[] | [];
  selectedCv: ICvData | null;
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
  acountId: string;
  phone: string;
  address: string;
  website: string;
  description: string;
}

export interface ICompanyData {
  name: string;
  email: string;
  avatar: string;
  Company: ICompany;
}

interface adminForCompanyById {
  name: string;
  avatar: string;
  email: string;
  isVerified: boolean;
}
export interface ICompanyById {
  id: string;
  acountId: string;
  phone: string;
  address: string;
  website: string;
  description: string;
  account: adminForCompanyById;
}

export interface IEduForm {
  eduLevelName: string;
  school: string;
  discipline: string;
  beginDate: string;
  finishDate: string;
  isStillStudying: boolean;
  desc: string;
}

export interface IChooseSkill {
  skillName: string;
}

export interface ISkillScore {
  id: string;
  skillId: string;
  score: number;
  userSkillId: string;
}

export interface ITestQuestion {
  id: string;
  testId: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  answer: string;
  imageUrl: string | null;
}

export interface ICompReviewForm {
  salary: number;
  culture: number;
  wlb: number;
  facility: number;
  career: number;
  desc: string;
}
