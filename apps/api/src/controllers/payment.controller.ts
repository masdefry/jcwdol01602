import prisma from '@/prisma';
import { Request, Response, NextFunction } from 'express';

export class PaymentController {
  async delPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      // check if id not available
      if (!id) {
        throw new Error('Id not available');
      }
      console.log(id);
      // Check if id exist in database
      const findPayment = await prisma.payment.findFirst({
        where: { id: id },
      });
      console.log(findPayment);
      if (!findPayment) {
        throw new Error('Invoice data not found');
      }
      // Delete subsData from database
      await prisma.payment.delete({
        where: { id: findPayment.id },
      });
      return res.status(200).send({
        message: `Payment with id: ${findPayment.id}, deleted successfully`,
      });
    } catch (error) {
      next(error);
    }
  }
}
