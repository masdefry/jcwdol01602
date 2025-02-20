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
    this.router.get('/categories', this.subsCtgController.allSubsCategory);

    this.router.post(
      '/category/new',
      verifyToken,
      devGuard,
      NewSubsCtgValidation,
      this.subsCtgController.newSubsCategory,
    );

    this.router.patch(
      '/category/:id',
      verifyToken,
      devGuard,
      NewSubsCtgValidation,
      this.subsCtgController.editSubsCategory,
    );

    this.router.delete(
      '/category/:id',
      verifyToken,
      devGuard,
      this.subsCtgController.deleteSubsCategory,
    );

    // Get All Subs Datas
    this.router.get(
      '/datas',
      verifyToken,
      devGuard,
      this.subsDataController.allSubsData,
    );

    // Update user subscription category
    this.router.patch(
      '/update/:ctgId',
      verifyToken,
      userDevGuard,
      this.subsDataController.updateSubsData,
    );
  }
  getRouter(): Router {
    return this.router;
  }
}
