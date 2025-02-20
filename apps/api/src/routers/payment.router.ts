import { PaymentController } from '@/controllers/payment.controller';
import {
  devGuard,
  userDevGuard,
  verifyToken,
} from '@/middlewares/auth.middleware';
import { uploadImage } from '@/middlewares/multer';
import { Router } from 'express';

export class PaymentRouter {
  private router: Router;
  private paymentController: PaymentController;

  constructor() {
    this.paymentController = new PaymentController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Cancel payment
    this.router.delete(
      '/:paymentId',
      verifyToken,
      userDevGuard,
      this.paymentController.deletePayment,
    );

    // Add payment method
    this.router.patch(
      '/method/:paymentId',
      verifyToken,
      userDevGuard,
      this.paymentController.methodPayment,
    );

    // Get all payment datas
    this.router.get(
      '/datas',
      verifyToken,
      devGuard,
      this.paymentController.allPayment,
    );

    // Upload payment proof
    this.router.patch(
      '/proof/:paymentId',
      verifyToken,
      userDevGuard,
      uploadImage,
      this.paymentController.uploadPaymentProof,
    );

    // Update payment approval
    this.router.patch(
      '/approval/:paymentId',
      verifyToken,
      devGuard,
      this.paymentController.approvalPayment,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
