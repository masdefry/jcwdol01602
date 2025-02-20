export interface Job {
  id: string;
  companyId: string;
  title: string;
  description: string;
  category: string;
  location: string;
  salaryRange?: string;
  deadline?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  description?: string;
  logo?: string;
}
