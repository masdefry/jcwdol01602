import { createDate } from './createDate';
import prisma from '@/prisma';

export const compReviewIdMaker = async () => {
  const customIdPrefix = `crv${createDate}`;
  const lastCompReview = await prisma.compReview.findFirst({
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
  if (lastCompReview) {
    // Extract the last sequence number using regex
    const match = lastCompReview.id.match(/-(\d+)$/);
    if (match) {
      nextIdNumber = parseInt(match[1], 10) + 1;
    }
  }
  // Format the customId
  const customId = `${customIdPrefix}-${nextIdNumber.toString().padStart(3, '0')}`;
  return customId;
};
