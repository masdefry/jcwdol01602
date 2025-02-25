import { companyIdMaker } from '@/lib/adminId';
import prisma from '@/prisma';

export const newCompany = async (adminId: string, compPhone: string) => {
  try {
    // Check if company name already exist
    const companyId = await companyIdMaker(adminId);
    const company = await prisma.company.create({
      data: {
        id: companyId,
        accountId: adminId,
        phone: compPhone,
      },
    });
    return company;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error(error);
  }
};
