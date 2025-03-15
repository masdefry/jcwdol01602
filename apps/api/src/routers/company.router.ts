import { Router } from 'express';
import { CompanyController } from '@/controllers/company.controller';
import {
  adminDevGuard,
  userDevGuard,
  verifyToken,
} from '@/middlewares/auth.middleware';
import { CompReviewController } from '@/controllers/compReview.controller';
import { companyValidation } from '@/middlewares/company.validation';

export class CompanyRouter {
  private router: Router;
  private companyController: CompanyController;
  private compReviewController: CompReviewController;

  constructor() {
    this.router = Router();
    this.companyController = new CompanyController();
    this.compReviewController = new CompReviewController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.patch(
      '/edit',
      companyValidation,
      verifyToken,
      adminDevGuard,
      this.companyController.editCompany,
    );

    this.router.get('/data/:companyId', this.companyController.getCompanyData);
    this.router.get(
      '/reviews/:companyId',
      this.compReviewController.showCompanyReview,
    );

    this.router.post(
      '/add-review/:companyId',
      verifyToken,
      userDevGuard,
      this.compReviewController.newCompReview,
    );

    this.router.patch(
      '/edit-review/:compReviewId',
      verifyToken,
      userDevGuard,
      this.compReviewController.updateCompReview,
    );

    this.router.get(
      '/all-review',
      verifyToken,
      adminDevGuard,
      this.compReviewController.compReviewForCompany,
    );

    this.router.delete(
      '/delete-review/:compReviewId',
      verifyToken,
      this.compReviewController.deleteCompReview,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
