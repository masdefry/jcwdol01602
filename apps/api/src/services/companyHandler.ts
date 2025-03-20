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

export const getCompanyByAdmin = async (adminId: string) => {
  try {
    const company = await prisma.company.findUnique({
      where: { accountId: adminId },
    });
    return company;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error(`Unexpected Error - getCompanyByAdmin : ` + error);
  }
};

export const getCompanyById = async (companyId: string) => {
  try {
    let company = null;
    company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        account: {
          select: {
            name: true,
            avatar: true,
            email: true,
            isVerified: true,
          },
        },
      },
    });
    if (company?.account.isVerified === false) {
      return (company = null);
    }
    return company;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error(`Unexpected Error - getCompanyById : ` + error);
  }
};

export const editCompany = async (
  companyId: string,
  data: {
    phone?: string;
    address?: string;
    website?: string;
    description?: string;
  }
) => {
  try {
    const updatedCompany = await prisma.company.update({
      where: { id: companyId },
      data: data,
    });
    return updatedCompany;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error(`Unexpected Error - editCompany: ` + error);
  }
};
