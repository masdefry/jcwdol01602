import prisma from '@/prisma';
import { editSubsDataApproval, editSubsDataCtg } from './subsDataHandler';
import { paymentMethod } from '@prisma/client';
import { BANK_ACCOUNT } from '@/config';
import { addCldPayProof, delCldPayProof } from './cloudinary';
import { PaymentIdMaker } from '@/lib/customId';

export const newPay = async (subsDataId: string, subsCtgId: string) => {
  try {
    if (!subsDataId)
      throw new Error(`newPay: subsDataId doesn't exist on prop`);
    const paymentId = await PaymentIdMaker();
    const payment = await prisma.payment.create({
      data: {
        id: paymentId,
        subsDataId: subsDataId,
        subsCtgId: subsCtgId,
      },
    });
    return payment;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error('newPay-unexpected error' + error);
  }
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

export const delPay = async (paymentId: string, userId: string) => {
  try {
    // Check if paymentId exist in db
    const findPayment = await getPayById(paymentId);
    if (!findPayment) {
      throw new Error('Invoice data not found');
    }

    // Delete Payment from cloudinary if payment proof exist
    if (findPayment.proof) {
      try {
        await delCldPayProof(findPayment.proof);
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
    await editSubsDataCtg(userId, undefined, 'free');
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

export const getPayBySubsData = async (subsDataId: string) => {
  try {
    let payments = null;
    payments = await prisma.payment.findMany({
      where: {
        subsDataId,
      },
    });
    if (payments.length === 0) return (payments = 'No data');
    return payments;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw error;
  }
};

const findMethod = (name: string): paymentMethod => {
  if (!Object.values(paymentMethod).includes(name as paymentMethod)) {
    throw new Error(`Invalid payment method: ${name}`);
  }
  return name as paymentMethod;
};

export const editPayMethod = async (paymentId: string, method: string) => {
  try {
    const payment = await getPayById(paymentId);
    if (!payment) throw new Error('No invoice found');
    if (payment.isApproved === true) {
      throw new Error(
        'Your payment is already approved, no need further action.',
      );
    }
    let transferTo = null;
    if (method === 'transfer') {
      transferTo = `Please transfer to BCA - ${BANK_ACCOUNT} and please upload your transaction proof`;
    } else if (method === 'midtrans') {
      transferTo = 'Please please proceed your payment to midtrans';
    } else {
      throw new Error('Invalid payment method');
    }
    const checkMethod = findMethod(method);
    const data = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        method: checkMethod,
      },
    });
    const result = { transferTo, data };
    console.log(result);
    return result;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error('Failed to update payment method : ' + error);
  }
};

export const editPayProof = async (
  paymentId: string,
  image: Express.Multer.File,
) => {
  try {
    const findPayment = await getPayById(paymentId);
    if (!findPayment) throw new Error('No invoice found');
    // Check payment method
    if (findPayment.method === null)
      throw new Error('Please choose payment method first');
    if (findPayment.isApproved === true)
      throw new Error(
        'Your payment is already approved, no need further action',
      );
    const imageUrl = await addCldPayProof(image, findPayment.id);
    const data = await prisma.payment.update({
      where: { id: findPayment.id },
      data: {
        proof: imageUrl.secure_url,
        isApproved: null,
      },
    });

    return data;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error('Unexpected error occured : ' + error);
  }
};

export const editPayApproval = async (
  paymentId: string,
  devId: string,
  isApproved: boolean,
) => {
  try {
    const findPayment = await getPayById(paymentId);
    if (!findPayment) throw new Error('No invoice found');
    if (findPayment.method === null || !findPayment.proof)
      throw new Error('Payment is not yet proceeded by the user');
    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        isApproved,
        approvalById: devId,
      },
    });
    // update subsData if approved by develeoper
    let approvalSubsData = null;
    if (payment.isApproved === true) {
      approvalSubsData = await editSubsDataApproval(findPayment.subsDataId);
    }

    return isApproved === true ? { payment, approvalSubsData } : payment;
  } catch (error: any) {
    if (error.message) {
      throw new Error(error.message);
    }
    throw new Error('Unexpected error occured in editPayApproval : ' + error);
  }
};
