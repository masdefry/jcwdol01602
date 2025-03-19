import prisma from '@/prisma';
import { editSubsDataApproval, editSubsDataCtg } from './subsDataHandler';
import { paymentMethod } from '@prisma/client';
import { BANK_ACCOUNT, SECRET_MIDTRANS, snap } from '@/config';
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

export const getPayById = async (PaymentId: string) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: PaymentId },
      include: {
        subsCtg: true,
      },
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

    if (findPayment.method === 'midtrans' && findPayment.id) {
      try {
        const midtransApi = `https://api.sandbox.midtrans.com/v2/${findPayment.id}/cancel`;

        const response = await fetch(midtransApi, {
          method: 'POST',
          headers: {
            Authorization:
              'Basic ' + Buffer.from(SECRET_MIDTRANS + ':').toString('base64'),
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(
            result.message || 'Failed to cancel transaction on Midtrans.',
          );
        }
      } catch (error: any) {
        console.error('Failed to cancel Midtrans order:', error.message);
        throw new Error('Failed to cancel transaction on Midtrans.');
      }
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
      include: {
        subsCtg: true,
      },
    });
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
    let token = null;
    if (method === 'transfer') {
      transferTo = `Please transfer to BCA - ${BANK_ACCOUNT} and please upload your transaction proof`;
    } else if (method === 'midtrans') {
      const parameter = {
        transaction_details: {
          order_id: payment.id,
          gross_amount: payment.subsCtg.price,
        },
        item_details: {
          name: `Payment for subscription plan '${payment.subsCtg.name}'`,
          price: payment.subsCtg.price,
          quantity: 1,
        },
      };
      token = await snap.createTransactionToken(parameter);
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
    return method === 'transfer' ? { transferTo, data } : { token, data };
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

export const approvePayByMidtrans = async (
  paymentId: string,
  transaction_status: string,
) => {
  try {
    const findPayment = await getPayById(paymentId);
    if (!findPayment) throw new Error(`Payment data doesn't exist`);
    let payment = null;
    let subsData = null;
    if (
      transaction_status === 'settlement' ||
      transaction_status === 'capture'
    ) {
      payment = await prisma.payment.update({
        where: { id: findPayment.id },
        data: {
          isApproved: true,
        },
      });
      subsData = await editSubsDataApproval(findPayment.subsDataId);
    } else {
      throw new Error(`Payment doesn't complete`);
    }
    return { payment, subsData };
  } catch (error: any) {
    if (error.message) {
      throw new Error(error.message);
    }
    throw new Error(
      'Unexpected error occured in approvePayByMidtrans : ' + error,
    );
  }
};
