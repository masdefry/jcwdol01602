import { SubsCtgController } from '@/controllers/subsCtg.controller';
import { SubsDataController } from '@/controllers/subsData.controller';
import {
  devGuard,
  userDevGuard,
  verifyToken,
} from '@/middlewares/auth.middleware';
import { NewSubsCtgValidation } from '@/middlewares/subs.validation';
import { Router } from 'express';

export class SubsRouter {
  private router: Router;
  private subsCtgController: SubsCtgController;
  private subsDataController: SubsDataController;

  constructor() {
    this.subsCtgController = new SubsCtgController();
    this.subsDataController = new SubsDataController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Get All Subs Category
    this.router.get('/allSubsCtg', this.subsCtgController.getAllSubsCtg);

    // New Subs Category
    this.router.post(
      '/new',
      verifyToken,
      devGuard,
      NewSubsCtgValidation,
      this.subsCtgController.createSubsCtg,
    );

    // Edit Subs Category
    this.router.patch(
      '/category/:id',
      verifyToken,
      devGuard,
      NewSubsCtgValidation,
      this.subsCtgController.editSubsCtg,
    );

    // Delete Subs Category
    this.router.delete(
      '/:id',
      verifyToken,
      devGuard,
      this.subsCtgController.delSubsCtg,
    );

    // Get All Subs Datas
    this.router.get(
      '/allSubsDatas',
      verifyToken,
      devGuard,
      this.subsDataController.getAllSubsDatas,
    );

    // Update user subscription category
    this.router.patch(
      '/user/:subsCtgId',
      verifyToken,
      userDevGuard,
      this.subsDataController.updateSubscription,
    );
  }
  getRouter(): Router {
    return this.router;
  }
}
