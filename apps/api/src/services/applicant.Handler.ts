import prisma from '@/prisma';
import { ApplicantStatus } from '@prisma/client';

export const getApplicantsByJobId = async (
  jobId: string,
  filters: {
    name?: string;
    age?: string | number;
    expectedSalary?: string | number;
    education?: string;
  }
) => {
  try {
    let birthDateFilter = {};
    if (filters.age) {
      const age = Number(filters.age);
      const now = new Date();
      const birthDateMax = new Date(now.getFullYear() - age, now.getMonth(), now.getDate());
      const birthDateMin = new Date(now.getFullYear() - age - 1, now.getMonth(), now.getDate() + 1);
      birthDateFilter = {
        userProfilie: {
          some: {
            dob: {
              lte: birthDateMax,
              gte: birthDateMin,
            },
          },
        },
      };
    }

    const applicants = await prisma.applicant.findMany({
      where: {
        jobId,
        expectedSalary: filters.expectedSalary
          ? Number(filters.expectedSalary)
          : undefined,
        education: filters.education
          ? { contains: filters.education}
          : undefined,
        subsData: {
          accounts: filters.name
            ? { name: { contains: filters.name } }
            : undefined,
          ...birthDateFilter,
        },
      },
      include: {
        subsData: {
          include: {
            accounts: true,
            userProfilie: true,
            userEdu: true,
          },
        },
      },
      orderBy: { appliedAt: 'asc' },
    });
    return applicants;
  } catch (error) {
    throw error;
  }
};

export const getApplicantById = async (applicantId: string) => {
  try {
    const applicant = await prisma.applicant.findUnique({
      where: { id: applicantId },
    });
    return applicant;
  } catch (error) {
    throw error;
  }
};

export const getApplicantWithUserAndJob = async (applicantId: string) => {
  try {
    const applicant = await prisma.applicant.findUnique({
      where: { id: applicantId },
      include: {
        subsData: {
          include: {
            accounts: true,
            userProfilie: true,
            userEdu: true,
          },
        },
        job: true,
        InterviewSchedule: true,
      },
    });
    return applicant;
  } catch (error) {
    throw error;
  }
};

export const updateApplicantStatus = async (
  applicantId: string,
  status: ApplicantStatus
) => {
  try {
    const updatedApplicant = await prisma.applicant.update({
      where: { id: applicantId },
      data: { status: status },
    });
    return updatedApplicant;
  } catch (error) {
    throw error;
  }
};
