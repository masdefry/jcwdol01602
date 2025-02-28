import prisma from '@/prisma';
import { getCompanyByAdmin } from './companyHandler';

export const getCompReviewById = async (compReviewId: string) => {
  try {
    const data = await prisma.compReview.findUnique({
      where: { id: compReviewId },
    });
    return data;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error(`Unexpected Error - getCompReviewById : ` + error);
  }
};

export const getCompReviewForAdmin = async (adminId: string) => {
  try {
    const company = await getCompanyByAdmin(adminId);
    if (!company) throw new Error(`Company data doesn't exist`);
    const data = await prisma.compReview.findMany({
      where: {
        companyId: company.id,
      },
    });
    return data;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error(`Unexpected Error - getCompReviewForAdmin : ` + error);
  }
};
