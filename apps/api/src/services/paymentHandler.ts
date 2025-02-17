import prisma from '@/prisma';
import { editSubsDataCtg } from './subsDataHandler';
import { paymentMethod } from '@prisma/client';
import { BANK_ACCOUNT } from '@/config';
import { delCldPayProof } from './cloudinary';
import { PaymentIdMaker } from '@/lib/customId';

export const newPay = async (subsDataId: string) => {
  if (!subsDataId) throw new Error(`newPay: subsDataId doesn't exist on prop`);
  const paymentId = await PaymentIdMaker();
  const payment = await prisma.payment.create({
    data: {
      id: paymentId,
      subsDataId: subsDataId,
    },
  });
  return payment;
};

export const getPayById = async (id: string) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id },
    });
    return payment;
  } catch (error) {
    throw error;
  }
};

export const delPay = async (
  paymentId: string,
  subsDataId: string,
  ctgId: string,
  proofUrl?: string,
) => {
  try {
    // Delete Payment from cloudinary if payment proof exist
    if (proofUrl && proofUrl.trim() !== '') {
      try {
        await delCldPayProof(proofUrl);
      } catch (error: any) {
        throw new Error(
          'Failed to delete payment proof from Cloudinary:' + error.message,
        );
      }
    }
    // Delete payment
    const payment = await prisma.payment.delete({
      where: { id: paymentId },
    });
    // Restore subsCategory to 'free'
    await editSubsDataCtg(subsDataId, ctgId);
    return payment;
  } catch (error) {
    throw error;
  }
};

export const getPayAll = async () => {
  try {
    let datas = null;
    datas = await prisma.payment.findMany();
    if (datas.length === 0) return (datas = 'No data');
    return datas;
  } catch (error: any) {
    throw new Error('Failed to get all payments data : ' + error.message);
  }
};

const findMethod = (name: string): paymentMethod => {
  if (!Object.values(paymentMethod).includes(name as paymentMethod)) {
    throw new Error(`Invalid payment method: ${name}`);
  }
  return name as paymentMethod;
};

export const editPayMethod = async (id: string, method: string) => {
  try {
    let transferTo = null;
    if (method === 'transfer') {
      transferTo = `Please transfer to BCA - ${BANK_ACCOUNT} and please upload your transaction proof`;
    } else if (method === 'midtrans') {
      transferTo = 'Please please proceed your payment to midtrans';
    }
    const checkMethod = findMethod(method);
    const data = await prisma.payment.update({
      where: { id },
      data: {
        method: checkMethod,
      },
    });
    const result = { transferTo, data };
    console.log(result);
    return result;
  } catch (error: any) {
    throw new Error('Failed to create payment method : ' + error.message);
  }
};

export const editPayProof = async (id: string, imageUrl: string) => {
  try {
    const data = await prisma.payment.update({
      where: { id },
      data: {
        proof: imageUrl,
      },
    });

    if (!data) throw new Error('Failed to store payment proof');
    return data;
  } catch (error: any) {
    throw new Error('Unexpected error occured : ' + error.message);
  }
};

export const editPayApproval = async (
  paymentId: string,
  devId: string,
  isApproved: boolean,
) => {
  try {
    const data = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        isApproved,
        approvalById: devId,
      },
    });
    return data;
  } catch (error: any) {
    throw new Error('Unexpected error occured : ' + error.message);
  }
};
