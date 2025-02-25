import { Router } from 'express';
import { CompanyController } from '@/controllers/company.controller';
import { adminDevGuard, verifyToken } from '@/middlewares/auth.middleware';

export class CompanyRouter {
  private router: Router;
  private companyController: CompanyController;

  constructor() {
    this.router = Router();
    this.companyController = new CompanyController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.patch(
      '/edit',
      verifyToken,
      adminDevGuard,
      this.companyController.editCompany,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
