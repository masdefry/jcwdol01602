import { Router } from 'express';
import { JobController } from '@/controllers/job.controller';
import { verifyToken, adminDevGuard } from '@/middlewares/auth.middleware';
import { JobValidation } from '@/middlewares/job.validation';

export class JobRouter {
  private router: Router;
  private jobController: JobController;

  constructor() {
    this.jobController = new JobController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/create', verifyToken, adminDevGuard, JobValidation, this.jobController.createJob);
    this.router.put('/:id', verifyToken, adminDevGuard, JobValidation, this.jobController.updateJob);
    this.router.delete('/:id', verifyToken, adminDevGuard, this.jobController.deleteJob);
    this.router.get('/list', verifyToken, adminDevGuard, this.jobController.getAllJobs);
    this.router.get('/:id', verifyToken, adminDevGuard, this.jobController.getJobDetails);
    this.router.patch('/:id/publish', verifyToken, adminDevGuard, this.jobController.togglePublish);
  }

  getRouter(): Router {
    return this.router;
  }
}
