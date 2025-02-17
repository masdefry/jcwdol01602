import { Account } from '@/custom';
import prisma from '@/prisma';
import {
  editSubsDataCtg,
  getSubsDataAll,
  getSubsDataById,
  getSubsDataByUser,
} from '@/services/subsDataHandler';
import { Response, Request, NextFunction } from 'express';

export class SubsDataController {
  async allSubsData(req: Request, res: Response, next: NextFunction) {
    try {
      const subsDatas = await getSubsDataAll();
      if (subsDatas.length === 0)
        return res.status(200).send({ message: 'No data', subsDatas });
      return res.status(200).send({
        message: 'Subcription data retrieved successfully',
        subsDatas,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateSubsData(req: Request, res: Response, next: NextFunction) {
    try {
      // Get the SubsCategoryId
      const { ctg } = req.params;
      if (!ctg) throw new Error('Please choose your subscription first');

      // Get the user account
      const user = req.account as Account;

      // find subsData with user id
      const subsData = await getSubsDataByUser(user.id);
      if (!subsData)
        throw new Error('No subscription data found for this user');

      //   Check if user has unpaid payment
      const unPaidPayment = subsData.payment.find((payment) => !payment.proof);
      if (unPaidPayment)
        throw new Error(
          'You have an unpaid payment, please proceed your previous payment first',
        );

      // Only for development
      // Check if user has paid payment but not yet approved
      const unApprovePayment = subsData.payment.find(
        (payment) => payment.isApproved === false,
      );
      if (unApprovePayment)
        throw new Error(
          'Your previous payment is not yet approved by our admin, please try again later',
        );

      // update category id in subsData and create new payment data
      const update = await editSubsDataCtg(subsData.id, ctg);

      return res.status(200).send({
        message: `Your subscription is updated`,
        subsData: update,
      });
    } catch (error) {
      next(error);
    }
  }

  // For development only! Don't forget to delete this code later!
  async deleteSubsData(req: Request, res: Response, next: NextFunction) {
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
