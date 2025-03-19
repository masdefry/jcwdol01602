import prisma from '@/prisma';
import { createDate } from './createDate';

// compYYMMDD-000-accountId
export const companyIdMaker = async (adminId: string) => {
  const customIdPrefix = `comp${createDate}`;
  const lastCompany = await prisma.company.findFirst({
    where: {
      id: {
        startsWith: customIdPrefix,
      },
    },
    orderBy: {
      id: `desc`,
    },
  });
  let nextIdNumber = 1;
  if (lastCompany) {
    const match = lastCompany.id.match(/-(\d+)$/);
    if (match) {
      nextIdNumber = parseInt(match[1], 10) + 1;
    }
  }
  const customId = `${customIdPrefix}-${nextIdNumber.toString().padStart(3, '0')}-${adminId}`;
  return customId;
};

export const JobIdMaker = async () => {
  const customIdPrefix = `job${createDate}`;
  const lastJob = await prisma.job.findFirst({
    where: { id: { startsWith: customIdPrefix } },
    orderBy: { id: 'desc' },
  });
  let nextIdNumber = 1;
  if (lastJob) {
    const match = lastJob.id.match(/-(\d+)$/);
    if (match) {
      nextIdNumber = parseInt(match[1], 10) + 1;
    }
  }
  const customId = `${customIdPrefix}-${nextIdNumber.toString().padStart(3, '0')}`;
  return customId;
};

export const ApplicantIdMaker = async () => {
  const customIdPrefix = `app${createDate}`;
  const lastApplicant = await prisma.applicant.findFirst({
    where: { id: { startsWith: customIdPrefix } },
    orderBy: { id: 'desc' },
  });
  let nextIdNumber = 1;
  if (lastApplicant) {
    const match = lastApplicant.id.match(/-(\d+)$/);
    if (match) {
      nextIdNumber = parseInt(match[1], 10) + 1;
    }
  }
  const customId = `${customIdPrefix}-${nextIdNumber.toString().padStart(3, '0')}`;
  return customId;
};

export const InterviewScheduleIdMaker = async () => {
  const customIdPrefix = `ins${createDate}`;
  const lastInterviewSchedule = await prisma.interviewSchedule.findFirst({
    where: { id: { startsWith: customIdPrefix } },
    orderBy: { id: 'desc' },
  });
  let nextIdNumber = 1;
  if (lastInterviewSchedule) {
    const match = lastInterviewSchedule.id.match(/-(\d+)$/);
    if (match) {
      nextIdNumber = parseInt(match[1], 10) + 1;
    }
  }
  const customId = `${customIdPrefix}-${nextIdNumber.toString().padStart(3, '0')}`;
  return customId;
};

export const PreSelectionTestIdMaker = async (jobId: string) => {
  const customId = `pst${createDate}-${jobId}`;
  return customId;
};

export const PreSelectionQuestionIdMaker = async () => {
  const customIdPrefix = `psq${createDate}`;
  const lastQuestion = await prisma.preSelectionQuestion.findFirst({
    where: { id: { startsWith: customIdPrefix } },
    orderBy: { id: 'desc' },
  });
  let nextIdNumber = 1;
  if (lastQuestion) {
    const match = lastQuestion.id.match(/-(\d+)$/);
    if (match) {
      nextIdNumber = parseInt(match[1], 10) + 1;
    }
  }
  const customId = `${customIdPrefix}-${nextIdNumber.toString().padStart(3, '0')}`;
  return customId;
};

export const PreSelectionTestResultIdMaker = async (testId: string) => {
  const customId = `psr${createDate}-${testId}`;
  return customId;
};

export const PreSelectionAnswerIdMaker = async (questionId: string) => {
  const customId = `psa${createDate}-${questionId}`;
  return customId;
};
