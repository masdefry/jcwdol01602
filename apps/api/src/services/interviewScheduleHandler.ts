import prisma from '@/prisma';

export const createInterviewSchedule = async (
  applicantId: string,
  adminId: string,
  startTime: Date,
  endTime: Date,
  location?: string,
  notes?: string,
) => {
  try {
    const schedule = await prisma.interviewSchedule.create({
      data: {
        applicantId,
        adminId,
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

export const getInterviewSchedulesByAdminId = async (adminId: string) => {
  try {
    const schedules = await prisma.interviewSchedule.findMany({
      where: { adminId },
      include: { applicant: { include: { subsData: { include: { accounts: true } } } } },
    });
    return schedules;
  } catch (error) {
    throw error;
  }
};

export const getInterviewSchedulesByApplicantId = async (applicantId: string) => {
  try {
    const schedules = await prisma.interviewSchedule.findMany({
      where: { applicantId },
      include: { admin: true },
    });
    return schedules;
  } catch (error) {
    throw error;
  }
};
