import { Account } from '@/custom';
import {
  delPay,
  editPayApproval,
  editPayMethod,
  editPayProof,
  getPayAll,
} from '@/services/paymentHandler';
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
}
