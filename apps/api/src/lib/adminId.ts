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
