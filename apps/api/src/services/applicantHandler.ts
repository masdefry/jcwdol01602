import prisma from '@/prisma';
import { ApplicantStatus } from '@prisma/client';


export const getApplicantsByJobId = async (jobId: string) => {
  try {
    const applicants = await prisma.applicant.findMany({
      where: {
        jobId,
      },
      include: {
        subsData: {
          include: {
            accounts: true,
            userProfile: true,
            userEdu: true,
          },
        },
        job: true,
        InterviewSchedule: true,
        PreSelectionTestResult: true,
      },
      orderBy: { appliedAt: 'asc' },
    });
    return applicants;
  } catch (error) {
    console.error('Error fetching applicants by job ID:', error);
    throw error;
  }
};

export const getApplicantById = async (applicantId: string) => {
  try {
    const applicant = await prisma.applicant.findUnique({
      where: { id: applicantId },
      include: {
        subsData: {
          include: {
            accounts: true,
            userProfile: true,
            userEdu: true,
          },
        },
        job: true,
        InterviewSchedule: true,
        PreSelectionTestResult: true,
      },
    });
    return applicant;
  } catch (error) {
    console.error('Error fetching applicant by ID:', error);
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
            userProfile: true,
            userEdu: true,
          },

        },
        job: true,
        InterviewSchedule: true,
        PreSelectionTestResult: true,
      },
    });
    return applicant;
  } catch (error) {
    console.error('Error fetching applicant with user and job:', error);
    throw error;
  }
};

export const updateApplicantStatus = async (
  applicantId: string,
  status: ApplicantStatus,
) => {
  try {
    const updatedApplicant = await prisma.applicant.update({
      where: { id: applicantId },
      data: { status: status },
    });
    return updatedApplicant;
  } catch (error) {
    console.error('Error updating applicant status:', error);
    throw error;
  }
};
