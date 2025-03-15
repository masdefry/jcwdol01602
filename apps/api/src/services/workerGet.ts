import prisma from '@/prisma';
import { getSubsDataByUser } from './subsDataHandler';
import { getCompanyByAdmin } from './companyHandler';

export const getWorkerById = async (workerId: string) => {
  try {
    const data = await prisma.worker.findUnique({
      where: { id: workerId },
    });
    return data;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error(`Unexpected Error - getWorkById : ` + error);
  }
};

export const getAllWorkerByUser = async (userId: string) => {
  try {
    const subsData = await getSubsDataByUser(userId);
    if (!subsData) throw new Error(`Subscription data doesn't exist`);
    const allUserWork = await prisma.worker.findMany({
      where: { subsDataId: subsData.id },
      include: {
        compReview: true,
      },
    });
    return allUserWork;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error(`Unexpected Error - getAllUserWork : ` + error);
  }
};

export const getAllWorkerByCompany = async (adminId: string) => {
  try {
    const company = await getCompanyByAdmin(adminId);
    if (!company) throw new Error(`Company data doesn't exist`);
    const data = await prisma.worker.findMany({
      where: {
        companyId: company.id,
      },
      include: {
        subsData: {
          select: {
            accounts: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    return data;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error(`Unexpected Error - getAllWorkerByCompany : ` + error);
  }
};
