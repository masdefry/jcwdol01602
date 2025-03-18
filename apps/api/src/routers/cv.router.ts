import { CvController } from '@/controllers/cv.controller';
import { userDevGuard, verifyToken } from '@/middlewares/auth.middleware';
import { uploadCv } from '@/middlewares/multer';
import { Router } from 'express';

export class CvRouter {
  private router: Router;
  private cvController: CvController;

  constructor() {
    this.router = Router();
    this.cvController = new CvController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/upload',
      verifyToken,
      userDevGuard,
      uploadCv,
      this.cvController.addCv,
    );

    this.router.delete(
      '/delete/:cvId',
      verifyToken,
      userDevGuard,
      this.cvController.deleteCv,
    );

    this.router.patch(
      '/select/:cvId',
      verifyToken,
      userDevGuard,
      this.cvController.selectedCv,
    );

    this.router.get(
      '/my-datas',
      verifyToken,
      userDevGuard,
      this.cvController.userCvDatas,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
