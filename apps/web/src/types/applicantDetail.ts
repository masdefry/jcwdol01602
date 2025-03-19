import { ApplicantStatus } from '@prisma/client';

export interface Applicant {
    id: string;
    subsDataId: string;
    jobId: string;
    appliedAt: Date;
    expectedSalary: number | null;
    status: ApplicantStatus;
    subsData: {
        id: string;
        accountId: string;
        subsCtgId: string;
        startDate: Date | null;
        endDate: Date | null;
        isSubActive: boolean;
        cvPath: string | null;
        createdAt: Date;
        updatedAt: Date;
        accounts: {
            id: string;
            role: string;
            email: string;
            name: string;
            avatar: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        userProfile: {
            id: string;
            subsDataid: string;
            gender: string;
            pob: string;
            dob: Date;
            address: string;
            phoneNumber: string;
            createdAt: Date;
            updatedAt: Date;
        };
        userEdu: {
            level: string;
            school: string;
            discipline: string;
        }[];
    };
    job: {
        id: string;
        companyId: string;
        title: string;
        description: string;
        category: string;
        location: string;
        salaryRange: string;
        deadline: Date;
        isPublished: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
    InterviewSchedule: {
        id: string;
        applicantId: string;
        startTime: Date;
        endTime: Date;
        location: string;
        notes: string;
        createdAt: Date;
        updatedAt: Date;
    };
    PreSelectionTestResult: {
        length: number;
        id: string;
        applicantId: string;
        testId: string;
        score: number;
        total: number;
        createdAt: Date;
        updatedAt: Date;
    };
};

export interface IApplicantData {
    photo: JSX.Element;
    name: string;
    email: string;
    education: string;
    status: string;
    expectedSalary: number | null;
    id: string;
}
