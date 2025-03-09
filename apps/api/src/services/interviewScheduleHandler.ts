import prisma from '@/prisma';


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
        subsData: {
          select: {
            id: true,
            accounts: true,
            userProfilie: true,
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
    const schedule = await prisma.interviewSchedule.create({
      data: {
        applicantId,
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
      include: { applicant: { include: { subsData: { include: { accounts: true } } } } },
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

export const getInterviewSchedulesByApplicantId = async (applicantId: string) => {
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
