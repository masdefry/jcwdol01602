import { SubsDataIdMaker } from '@/lib/customId';
import prisma from '@/prisma';
import { newPay } from './paymentHandler';
import { getSubsCatById, getSubsCatByName } from './subsCtgHandler';

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
        subsCtg: true,
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
        subsCtg: true,
        payment: true,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const editSubsDataCtg = async (
  userId: string,
  ctgId?: string,
  ctgName?: string,
) => {
  try {
    // find subsData by user
    const subsData = await getSubsDataByUser(userId);
    if (!subsData) throw new Error('No subscription data found for this user');

    // Check if user has unpaid payment
    const unPaidPayment = subsData.payment.find((payment) => !payment.proof);
    if (unPaidPayment)
      throw new Error(
        'You have an unpaid payment, please proceed your previous payment first',
      );
    // Check if user has paid payment but not yet approved
    const noApprovePayment = subsData.payment.find(
      (payment) => payment.isApproved === null,
    );
    if (noApprovePayment)
      throw new Error(
        'Your previous payment is waiting for our admin approval, please try again later',
      );

    // Check if user has paid payment but not approved
    const unApprovePayment = subsData.payment.find(
      (payment) => payment.isApproved === false,
    );
    if (unApprovePayment)
      throw new Error(
        'Your previous payment is not approved, please fix your previous payment first',
      );

    let subsCtg = null;
    if (ctgId) {
      subsCtg = await getSubsCatById(ctgId);
      if (!subsCtg) throw new Error('Invalid subscription category ID');
    } else if (ctgName) {
      subsCtg = await getSubsCatByName(ctgName);
    } else {
      throw new Error('Invalid subsCtg input while updating subsData');
    }
    if (!subsCtg) throw new Error('Subscription category not found!');
    let result = null;
    const updateData = await prisma.subsData.update({
      where: { id: subsData.id },
      data: {
        subsCtgId: subsCtg.id,
        startDate: null,
        endDate: null,
        isSubActive: false,
      },
    });
    let payment = null;
    if (subsCtg.name === 'standard' || subsCtg.name === 'professional') {
      payment = await newPay(subsData.id, subsCtg.id);
      return (result = { updateData, payment });
    } else {
      result = updateData;
    }

    return result;
  } catch (error: any) {
    if (error.message) {
      throw new Error(error.message);
    }
    throw new Error('Unexpected error occured :' + error);
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
