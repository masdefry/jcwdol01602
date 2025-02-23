import prisma from '@/prisma';
import { createDate } from './createDate';

export const userProfIdMaker = async () => {
  const customIdPrefix = `up${createDate}`;
  const lastUserProfile = await prisma.userProfile.findFirst({
    where: {
      id: {
        startsWith: customIdPrefix,
      },
    },
    orderBy: {
      id: 'desc',
    },
  });
  let nextIdNumber = 1;
  if (lastUserProfile) {
    // Extract the last sequence number using regex
    const match = lastUserProfile.id.match(/-(\d+)$/);
    if (match) {
      nextIdNumber = parseInt(match[1], 10) + 1;
    }
  }
  // Format the customId
  const customId = `${customIdPrefix}-${nextIdNumber.toString().padStart(3, '0')}`;
  return customId;
};

export const userEduIdMaker = async () => {
  const customIdPrefix = `uedu${createDate}`;
  const lastUserEdu = await prisma.userEdu.findFirst({
    where: {
      id: {
        startsWith: customIdPrefix,
      },
    },
    orderBy: {
      id: 'desc',
    },
  });
  let nextIdNumber = 1;
  if (lastUserEdu) {
    // Extract the last sequence number using regex
    const match = lastUserEdu.id.match(/-(\d+)$/);
    if (match) {
      nextIdNumber = parseInt(match[1], 10) + 1;
    }
  }
  // Format the customId
  const customId = `${customIdPrefix}-${nextIdNumber.toString().padStart(3, '0')}`;
  return customId;
};

export const userSkillIdMaker = async (userId: string) => {
  const customIdPrefix = `usk`;
  const lastUserSkill = await prisma.userSkill.findFirst({
    where: {
      id: {
        startsWith: `${customIdPrefix}`,
        endsWith: `-${userId}`,
      },
    },
    orderBy: {
      id: 'desc',
    },
  });
  let nextIdNumber = 1;
  if (lastUserSkill) {
    const match = lastUserSkill.id.match(/usk(\d+)-/);
    if (match) {
      nextIdNumber = parseInt(match[1], 10) + 1;
    }
  }
  const customId = `${customIdPrefix}${nextIdNumber.toString().padStart(3, '0')}-${userId}`;
  return customId;
};
