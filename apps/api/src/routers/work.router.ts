import { WorkerController } from '@/controllers/worker.controller';
import {
  adminDevGuard,
  userDevGuard,
  verifyToken,
} from '@/middlewares/auth.middleware';
import { Router } from 'express';

export class WorkRouter {
  private router: Router;
  private workerController: WorkerController;

  constructor() {
    this.workerController = new WorkerController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // add new work experience
    this.router.post(
      '/new-work',
      verifyToken,
      userDevGuard,
      this.workerController.newWorkerUser,
    );
    // get all work experience by user
    this.router.get(
      '/my-work',
      verifyToken,
      userDevGuard,
      this.workerController.workerByUser,
    );
    // get all work experience by company
    this.router.get(
      '/by-company',
      verifyToken,
      adminDevGuard,
      this.workerController.workerByCompany,
    );
    // update work experience
    this.router.patch(
      '/update/:workerId',
      verifyToken,
      userDevGuard,
      this.workerController.updateWorkerUser,
    );

    // verify work
    this.router.patch(
      '/verify/:workerId',
      verifyToken,
      adminDevGuard,
      this.workerController.verifyWork,
    );
    // delete user's work experience
    this.router.delete(
      '/delete/:workerId',
      verifyToken,
      userDevGuard,
      this.workerController.deleteWorkerUser,
    );
  }
  getRouter(): Router {
    return this.router;
  }
}
