import { Account } from '@/custom';
import { addCldPayProof } from '@/services/cloudinary';
import {
  delPay,
  editPayApproval,
  editPayMethod,
  editPayProof,
  getPayAll,
  getPayById,
} from '@/services/paymentHandler';
import { getSubsCatByName } from '@/services/subsCtgHandler';
import {
  editSubsDataApproval,
  getSubsDataById,
  getSubsDataByUser,
} from '@/services/subsDataHandler';
import { Request, Response, NextFunction } from 'express';

export class PaymentController {
  async deletePayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      // check if id not available
      if (!id) {
        throw new Error('Id not available');
      }

      // get the user account
      const user = req.account as Account;

      // Check if paymentId exist in database
      const findPayment = await getPayById(id);
      if (!findPayment) {
        throw new Error('Invoice data not found');
      }

      // Get subs data
      const subsData = await getSubsDataByUser(user.id);
      if (!subsData) throw new Error('Subscription data not found!');

      // Get the default subscription category
      const subsCtg = await getSubsCatByName('free');
      if (!subsCtg) throw new Error('No subscription category found');

      // Delete payment from database
      let deletedPayment = null;
      if (findPayment.proof) {
        deletedPayment = await delPay(
          findPayment.id,
          subsData.id,
          subsCtg.id,
          findPayment.proof,
        );
      } else {
        deletedPayment = await delPay(findPayment.id, subsData.id, subsCtg.id);
      }
      return res.status(200).send({
        message: `Payment with id: ${findPayment.id}, deleted successfully`,
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
      const { id } = req.params;
      if (!id) throw new Error('No payment id provided');
      const { method } = req.body;
      if (!method) throw new Error('No payment method provided');
      const findpayment = await getPayById(id);
      if (!findpayment) throw new Error('No invoice found');
      const payment = await editPayMethod(id, method);

      return res.status(200).send({
        message: 'Create payment method successfull',
        payment,
      });
    } catch (error) {
      next(error);
    }
  }

  async uploadPaymentProof(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) throw new Error('No payment id provided');
      const findpayment = await getPayById(id);
      if (!findpayment) throw new Error('No invoice found');

      // Check payment method
      if (findpayment.method === null)
        throw new Error('Please choose payment method first');

      // Get image file from the form data
      const image = req.file;
      if (!image) throw new Error('No image file provided');

      const imageUrl = await addCldPayProof(image, findpayment.id);

      // Save the image url to payment database
      const updatePayment = await editPayProof(
        findpayment.id,
        imageUrl.secure_url,
      );

      return res.status(200).send({
        message: 'Payment proof sucessfully uploaded',
        payment: updatePayment,
      });
    } catch (error) {
      next(error);
    }
  }

  async approvalPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) throw new Error('No payment id provided');
      const findpayment = await getPayById(id);
      if (!findpayment) throw new Error('No invoice found');
      if (findpayment.method === null || !findpayment.proof)
        throw new Error('Payment is not yet proceeded by the user');

      // get the dev account
      const dev = req.account as Account;

      const { isApproved }: { isApproved: boolean } = req.body;
      if (!isApproved) throw new Error('Approval needed!');

      // update approval status
      const paymentStatus = await editPayApproval(
        findpayment.id,
        dev.id,
        isApproved,
      );

      // update subsdata if approved by developer
      let approvalSubsData = null;
      if (paymentStatus.isApproved === true) {
        const findSubsData = await getSubsDataById(findpayment.subsDataId);
        if (!findSubsData) throw new Error('Invalid subscription data Id');
        approvalSubsData = await editSubsDataApproval(findSubsData.id);
      }
      return res.status(200).send({
        message: 'Approval payment updated sucessfully',
        payment: paymentStatus,
        subsData: approvalSubsData,
      });
    } catch (error) {
      next(error);
    }
  }
}
