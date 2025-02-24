import { Router } from 'express';
import { ApplicantController } from '@/controllers/applicant.controller';
import { adminDevGuard } from '@/middlewares/auth.middleware';

export class ApplicantRouter {
  private router: Router;
  private applicantController: ApplicantController;

  constructor() {
    this.applicantController = new ApplicantController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/:jobId', adminDevGuard, this.applicantController.getApplicantsByJob);
    this.router.get('/details/:applicantId', adminDevGuard, this.applicantController.getApplicantDetails);
    this.router.patch('/:applicantId/status', adminDevGuard, this.applicantController.updateApplicantStatus);
  }

  getRouter(): Router {
    return this.router;
  }
}
