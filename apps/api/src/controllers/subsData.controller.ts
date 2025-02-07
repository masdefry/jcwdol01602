import { Account } from '@/custom';
import { PaymentIdMaker } from '@/lib/customId';
import prisma from '@/prisma';
import { Response, Request, NextFunction } from 'express';

export class SubsDataController {
  async getAllSubsDatas(req: Request, res: Response, next: NextFunction) {
    try {
      const subsDatas = await prisma.subsData.findMany();
      if (subsDatas.length === 0) throw new Error('No subs data found');
      return res.status(200).send({
        message: 'Subcription data retrieved successfully',
        subsDatas,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateSubscription(req: Request, res: Response, next: NextFunction) {
    try {
      // Get the SubsCategoryId
      const { subsCtgId } = req.params;
      if (!subsCtgId) throw new Error('Please choose your subscription first');

      // Find subscription Id in database
      const subsCategory = await prisma.subsCtg.findFirst({
        where: { id: subsCtgId },
      });
      if (!subsCategory) throw new Error('Invalid subscription category ID');

      // Get the user account
      const user = req.account as Account;

      // find subsData with user id
      const subsData = await prisma.subsData.findFirst({
        where: { accountId: user.id },
        include: {
          payment: {
            select: {
              id: true,
              isApproved: true,
            },
          },
        },
      });
      if (!subsData)
        throw new Error('No subscription data found for this user');

      //   Check if user has unpaid payment
      const unPaidPayment = subsData.payment.find(
        (payment) => !payment.isApproved,
      );
      if (unPaidPayment)
        throw new Error(
          'You have unpaid payment, please proceed your previous payment first',
        );

      //   Variable to store payment data
      let payment = null;

      // update category id in subsData and create new payment data
      const updateSubsData = await prisma.$transaction(async (prisma) => {
        // 1. Update subsData first
        const data = await prisma.subsData.update({
          where: { id: subsData.id },
          data: {
            subsCtgId: subsCategory.id,
          },
        });

        //  2. Create payment in database
        const paymentId = await PaymentIdMaker();
        payment = await prisma.payment.create({
          data: {
            id: paymentId,
            subsDataId: data.id,
          },
        });
        return data;
      });

      return res.status(200).send({
        message: `You have new subscription, please proceed to payment`,
        subsData: { updateSubsData, payment: payment },
      });
    } catch (error) {
      next(error);
    }
  }
  async delSubsData(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      // check if id not available
      if (!id) {
        throw new Error('Id not available');
      }
      // Check if id exist in database
      const findSubsData = await prisma.subsData.findFirst({
        where: { id },
      });
      if (!findSubsData) {
        throw new Error('Subscription data not found');
      }
      // Delete subsData from database
      await prisma.subsData.delete({
        where: { id: findSubsData.id },
      });
      return res.status(200).send({
        message: `Subscription data with id: ${findSubsData.id}, deleted successfully`,
      });
    } catch (error) {
      next(error);
    }
  }
}
