import prisma from '@/prisma';
import { createDate } from './createDate';

export const cldCvIdMaker = async (userId: string, cvId: string) => {
  const fileName = `${cvId}-${userId}`.trim();
  return fileName;
};

export const cvIdMaker = async () => {
  const customIdPrefix = `cv${createDate}`;
  const lastCvData = await prisma.cvData.findFirst({
    where: { id: { startsWith: customIdPrefix } },
    orderBy: { id: 'desc' },
  });
  let nextIdNumber = 1;
  if (lastCvData) {
    // Extract the last sequence number using regex
    const match = lastCvData.id.match(/-(\d+)$/);
    if (match) {
      nextIdNumber = parseInt(match[1], 10) + 1;
    }
  }
  const customId = `${customIdPrefix}-${nextIdNumber.toString().padStart(3, '0')}`;
  return customId;
};
