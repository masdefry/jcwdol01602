import { ApplicantController } from '@/controllers/applicant.controller';
import { verifyToken } from '@/middlewares/auth.middleware';
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
    this.router.get('/job/:jobId', verifyToken, this.applicantController.getApplicantsByJob);
    this.router.get('/:applicantId', verifyToken, this.applicantController.getApplicantDetails);
    this.router.patch('/:applicantId', verifyToken, this.applicantController.updateApplicantStatus);

  }

  getRouter(): Router {
    return this.router;
  }
}
