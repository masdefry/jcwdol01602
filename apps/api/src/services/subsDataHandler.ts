import { SubsDataIdMaker } from '@/lib/customId';
import prisma from '@/prisma';
import { newPay } from './paymentHandler';
import { getSubsCatById } from './subsCtgHandler';

export const addSubsData = async (userId: string, subsCtgId: string) => {
  const subsDataId = await SubsDataIdMaker(userId);
  const data = await prisma.subsData.create({
    data: {
      id: subsDataId,
      accountId: userId,
      subsCtgId: subsCtgId,
    },
  });
  return data;
};

export const getSubsDataAll = async () => {
  try {
    let datas = null;
    datas = await prisma.subsData.findMany({
      include: {
        accounts: true,
        subscription: true,
        payment: true,
      },
    });
    if (datas.length === 0) return (datas = 'No data');
    return datas;
  } catch (error) {
    throw error;
  }
};

export const getSubsDataById = async (subsDataId: string) => {
  try {
    const data = await prisma.subsData.findUnique({
      where: { id: subsDataId },
    });
    return data;
  } catch (error: any) {
    throw new Error('Failed to get subscription data : ' + error.message);
  }
};

export const getSubsDataByUser = async (id: string) => {
  try {
    const data = await prisma.subsData.findFirst({
      where: { accountId: id },
      include: {
        payment: true,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const editSubsDataCtg = async (id: string, ctgId: string) => {
  try {
    const subsCategory = await getSubsCatById(ctgId);
    if (!subsCategory) throw new Error('Invalid subscription category ID');
    let result = null;
    const updateData = await prisma.subsData.update({
      where: { id },
      data: {
        subsCtgId: subsCategory.id,
        startDate: null,
        endDate: null,
        isSubActive: false,
      },
    });
    let payment = null;
    if (
      subsCategory.name === 'standard' ||
      subsCategory.name === 'professional'
    ) {
      payment = await newPay(updateData.id);
      return (result = { updateData, payment });
    } else {
      result = updateData;
    }

    return result;
  } catch (error: any) {
    throw new Error('Failed to update subscription data : ' + error.message);
  }
};

export const editSubsDataApproval = async (subsDataId: string) => {
  try {
    const today = new Date();
    const expiredDate = new Date();
    expiredDate.setDate(today.getDate() + 30);

    const data = await prisma.subsData.update({
      where: { id: subsDataId },
      data: {
        startDate: today,
        endDate: expiredDate,
        isSubActive: true,
      },
    });
    return data;
  } catch (error: any) {
    throw new Error('Failed to update subscription data : ' + error.message);
  }
};
