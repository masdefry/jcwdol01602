import { ApplicantController } from '@/controllers/applicant.controller';
import {
  verifyToken,
  adminDevGuard,
  userDevGuard,
} from '@/middlewares/auth.middleware';
import { Router } from 'express';

export class ApplicantRouter {
  private router: Router;
  private applicantController: ApplicantController;

  constructor() {
    this.applicantController = new ApplicantController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      '/job/:jobId',
      verifyToken,
      adminDevGuard,
      this.applicantController.getApplicantsByJob,
    );

    this.router.get(
      '/details/:applicantId',
      verifyToken,
      adminDevGuard,
      this.applicantController.getApplicantDetails,
    );

    this.router.patch(
      '/:applicantId',
      verifyToken,
      adminDevGuard,
      this.applicantController.updateApplicantStatus,
    );

    this.router.get(
      '/id/:applicantId',
      verifyToken,
      adminDevGuard,
      this.applicantController.getApplicantById,
    );

    this.router.post(
      '/apply',
      verifyToken,
      userDevGuard,
      this.applicantController.applyJob,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
