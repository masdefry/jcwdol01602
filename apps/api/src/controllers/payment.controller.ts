import { Account } from '@/custom';
import {
  approvePayByMidtrans,
  delPay,
  editPayApproval,
  editPayMethod,
  editPayProof,
  getPayAll,
  getPayById,
  getPayBySubsData,
} from '@/services/paymentHandler';
import { getSubsDataByUser } from '@/services/subsDataHandler';
import { paymentMethod } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

export class PaymentController {
  async deletePayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { paymentId } = req.params;
      // check if id not available
      if (!paymentId) {
        throw new Error('Id not available');
      }
      // get the user account
      const user = req.account as Account;

      // Delete payment from database
      const deletedPayment = await delPay(paymentId, user.id);
      return res.status(200).send({
        message: `Payment with id: ${deletedPayment.id}, deleted successfully`,
        payment: deletedPayment,
      });
    } catch (error) {
      next(error);
    }
  }

  async paymentData(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.account as Account;
      const { paymentId } = req.params;
      const subsData = await getSubsDataByUser(user.id);
      if (!subsData) throw new Error('No subscription data found');
      let payment = null;
      payment = await getPayById(paymentId);
      if (!payment) {
        payment = 'No Data';
      } else if (payment && payment.subsDataId !== subsData.id) {
        throw new Error('Unauthorized to continue to get payment data');
      }
      return res.status(200).send({
        message: 'Payment retrieved successfully',
        payment,
      });
    } catch (error) {
      next(error);
    }
  }

  async allPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const payments = await getPayAll();
      if (!payments)
        return res.status(200).send({ message: 'No data', payments });
      return res.status(200).send({
        message: 'Payments retrieved successfully',
        payments,
      });
    } catch (error) {
      next(error);
    }
  }

  async methodPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { paymentId } = req.params;
      if (!paymentId) throw new Error('No payment id provided');
      const { method } = req.body;
      if (!method) throw new Error('No payment method provided');
      const payment = await editPayMethod(paymentId, method);

      return res.status(200).send({
        message: 'Payment method created sucessfully',
        payment,
      });
    } catch (error) {
      next(error);
    }
  }

  async uploadPaymentProof(req: Request, res: Response, next: NextFunction) {
    try {
      const { paymentId } = req.params;
      if (!paymentId) throw new Error('No payment id provided');

      // Get image file from the form data
      const image = req.file;
      if (!image) throw new Error('No image file provided');

      // Save the image url to payment database
      const updatePayment = await editPayProof(paymentId, image);

      return res.status(200).send({
        message: 'Payment proof uploaded sucessfully',
        payment: updatePayment,
      });
    } catch (error) {
      next(error);
    }
  }

  async approvalPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { paymentId } = req.params;
      if (!paymentId) throw new Error('No payment id provided');

      // get the dev account
      const dev = req.account as Account;

      const { isApproved }: { isApproved: boolean } = req.body;
      if (typeof isApproved !== 'boolean') throw new Error('Approval needed!');

      // update approval status
      const paymentStatus = await editPayApproval(
        paymentId,
        dev.id,
        isApproved,
      );

      return res.status(200).send({
        message: 'Approval payment updated sucessfully',
        payment: paymentStatus,
      });
    } catch (error) {
      next(error);
    }
  }

  async paymentOption(req: Request, res: Response, next: NextFunction) {
    try {
      const optionPayment = Object.values(paymentMethod);
      return res.status(200).send({
        message: 'Payment option retrieved successfully',
        optionPayment,
      });
    } catch (error) {
      next(error);
    }
  }

  async userPayments(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.account as Account;
      const subsData = await getSubsDataByUser(user.id);
      if (!subsData) throw new Error(`No subscription data exist`);
      let payments = null;
      payments = await getPayBySubsData(subsData.id);
      return res.status(200).send({
        message: 'Payments data retrieved successfully',
        payments,
      });
    } catch (error) {
      next(error);
    }
  }

  async midTransSuccess(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId, transactionStatus } = req.body;
      const result = await approvePayByMidtrans(orderId, transactionStatus);
      return res.status(200).send({
        message: 'Payment approved, your subscription plan is active',
        result,
      });
    } catch (error) {
      next(error);
    }
  }
}
