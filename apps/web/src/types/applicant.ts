export interface Applicant {
  id: string;
  user: {
    name: string;
    avatar?: string;
    Profile: {
      birthDate: string;
      education: string;
    };
  };
  expectedSalary: number;
  appliedAt: string;
  status: 'pending' | 'interview' | 'accepted' | 'rejected';
}
