import { PaymentController } from '@/controllers/payment.controller';
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
    // Delete payment -- for testing
    this.router.delete('/:id', this.paymentController.delPayment);
  }

  getRouter(): Router {
    return this.router;
  }
}
