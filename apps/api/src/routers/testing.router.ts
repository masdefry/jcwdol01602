import { TestController } from '@/controllers/testing.controller';
import { Router } from 'express';

export class TestingRouter {
  private router: Router;
  private testingController: TestController;

  constructor() {
    this.testingController = new TestController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/harish', this.testingController.getTestingRouter);
  }

  getRouter(): Router {
    return this.router;
  }
}
