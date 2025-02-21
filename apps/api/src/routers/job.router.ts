import { JobController } from '@/controllers/job.controller';
import { Router } from 'express';
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

  //verifyToken, adminDevGuard,

  private initializeRoutes(): void {
    // Create a new job posting (Admin only)
    this.router.post('/create', JobValidation, this.jobController.createJob);

    // Update job posting (Admin only)
    this.router.put('/:id', JobValidation, this.jobController.updateJob);

    // Delete job posting (Admin only)
    this.router.delete('/:id', this.jobController.deleteJob);

    // Get all jobs with filters (Admin only)
    this.router.get('/list', this.jobController.getAllJobs);

    // Get job details (Admin only)
    this.router.get('/:id', this.jobController.getJobDetails);

    // Publish / Unpublish job (Admin only)
    this.router.patch('/:id/publish', this.jobController.togglePublish);

    // // Get job applicants
    // this.router.get('/:id/applicants', verifyToken, adminDevGuard, this.jobController.getJobApplicants);
  }

  getRouter(): Router {
    return this.router;
  }
}
