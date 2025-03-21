import { Router } from 'express';
import { JobController } from '@/controllers/job.controller';
import { JobGetController } from '@/controllers/jobsGet.controller';
import { verifyToken, adminDevGuard } from '@/middlewares/auth.middleware';
import { JobValidation } from '@/middlewares/job.validation';

export class JobRouter {
  private router: Router;
  private jobController: JobController;
  private jobGetController: JobGetController;

  constructor() {
    this.jobController = new JobController();
    this.jobGetController = new JobGetController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/all-jobs', this.jobGetController.jobsPerPage);
    this.router.get('/locations-data', this.jobGetController.jobLocation);
    this.router.get('/categories-data', this.jobGetController.jobCategory);
    this.router.post(
      '/create',
      verifyToken,
      adminDevGuard,
      JobValidation,
      this.jobController.createJob,
    );
    this.router.put(
      '/:id',
      verifyToken,
      adminDevGuard,
      JobValidation,
      this.jobController.updateJob,
    );
    this.router.delete(
      '/:id',
      verifyToken,
      adminDevGuard,
      this.jobController.deleteJob,
    );
    this.router.get(
      '/list',
      verifyToken,
      adminDevGuard,
      this.jobController.getAllJobs,
    );
    this.router.get(
      '/:id',
      verifyToken,
      adminDevGuard,
      this.jobController.getJobDetails,
    );
    this.router.patch(
      '/:id/publish',
      verifyToken,
      adminDevGuard,
      this.jobController.togglePublish,
    );
    this.router.get(
      '/company/:accountId',
      verifyToken,
      adminDevGuard,
      this.jobController.getJobsCompany,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
