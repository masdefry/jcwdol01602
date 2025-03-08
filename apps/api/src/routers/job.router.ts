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

  // verifyToken, adminDevGuard,

  private initializeRoutes(): void {
    this.router.post('/create', JobValidation, this.jobController.createJob);
    this.router.put('/:id',  JobValidation, this.jobController.updateJob);
    this.router.delete('/:id',  this.jobController.deleteJob);
    this.router.get('/list', this.jobController.getAllJobs);
    this.router.get('/:id',  this.jobController.getJobDetails);
    this.router.patch('/:id/publish', this.jobController.togglePublish);
  }

  getRouter(): Router {
    return this.router;
  }
}
