import prisma from '@/prisma';
import { ApplicantIdMaker } from '@/lib/adminId';

export const getInterviewApplicantsByCompanyAccountId = async (
  companyAccountId: string,
) => {
  try {
    const applicants = await prisma.applicant.findMany({
      where: {
        job: {
          company: {
            accountId: companyAccountId,
          },
        },
        status: 'interview',
      },
      select: {
        id: true,
        jobId: true,
        InterviewSchedule: true,
        job: {
          select: {
            title: true,
          },
        },
        subsData: {
          select: {
            id: true,
            accounts: true,
            userProfile: true,
            userEdu: true,
            userSkill: {
              select: {
                id: true,
                skill: true,
              },
            },
          },
        },
      },
    });
    return applicants;
  } catch (error) {
    throw error;
  }
};

export const createInterviewSchedule = async (
  applicantId: string,
  startTime: Date,
  endTime: Date,
  location?: string,
  notes?: string,
) => {
  try {
    const applicantId = await ApplicantIdMaker();
    const schedule = await prisma.interviewSchedule.create({
      data: {
        applicantId: applicantId,
        startTime,
        endTime,
        location,
        notes,
      },
    });
    return schedule;
  } catch (error) {
    throw error;
  }
};

export const getInterviewScheduleById = async (scheduleId: string) => {
  try {
    const schedule = await prisma.interviewSchedule.findUnique({
      where: { id: scheduleId },
      include: {
        applicant: { include: { subsData: { include: { accounts: true } } } },
      },
    });
    return schedule;
  } catch (error) {
    throw error;
  }
};

export const updateInterviewSchedule = async (
  scheduleId: string,
  startTime?: Date,
  endTime?: Date,
  location?: string,
  notes?: string,
) => {
  try {
    const schedule = await prisma.interviewSchedule.update({
      where: { id: scheduleId },
      data: {
        startTime,
        endTime,
        location,
        notes,
      },
    });
    return schedule;
  } catch (error) {
    throw error;
  }
};

export const deleteInterviewSchedule = async (scheduleId: string) => {
  try {
    const schedule = await prisma.interviewSchedule.delete({
      where: { id: scheduleId },
    });
    return schedule;
  } catch (error) {
    throw error;
  }
};

export const getInterviewSchedulesByApplicantId = async (
  applicantId: string,
) => {
  try {
    const schedules = await prisma.interviewSchedule.findMany({
      where: { applicantId },
      include: { applicant: true },
    });
    return schedules;
  } catch (error) {
    throw error;
  }
};
