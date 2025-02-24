import { Router } from 'express';
import { CompanyController } from '@/controllers/company.controller';
import { verifyToken } from '@/middlewares/auth.middleware';


export class CompanyRouter {
  private router: Router;
  private companyController: CompanyController;

  constructor() {
    this.router = Router();
    this.companyController = new CompanyController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {

    this.router.post(
      '/create-company',
      verifyToken,
      this.companyController.createCompany,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
