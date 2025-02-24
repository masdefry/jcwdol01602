import prisma from '@/prisma';
import { ApplicantStatus } from '@prisma/client';

export const getApplicantsByJobId = async (jobId: string) => {
  try {
    const applicants = await prisma.applicant.findMany({
      where: { jobId },
      include: { user: { include: { accounts: true } } },
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
            include: { user: { include: { accounts: true, payment: true } }, job: true },
        });
        return applicant;
    } catch (error) {
        throw error;
    }
};


export const updateApplicantStatus = async (applicantId: string, status: ApplicantStatus) => {
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
