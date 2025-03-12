import { UserEduController } from '@/controllers/userEdu.controller';
import {
  adminDevGuard,
  userDevGuard,
  verifyToken,
} from '@/middlewares/auth.middleware';
import { Router } from 'express';

export class EduRouter {
  private router: Router;
  private userEduController: UserEduController;

  constructor() {
    this.userEduController = new UserEduController();
    this.router = Router();
    this.initializeRoutes();
  }
  private initializeRoutes(): void {
    this.router.get('/edu-level', this.userEduController.eduLevel);

    this.router.post(
      '/new',
      verifyToken,
      userDevGuard,
      this.userEduController.moreEducation,
    );

    this.router.patch(
      '/update/:eduId',
      verifyToken,
      userDevGuard,
      this.userEduController.updateEducation,
    );
    this.router.delete(
      '/delete/:eduId',
      verifyToken,
      userDevGuard,
      this.userEduController.deleteEducation,
    );
    this.router.get(
      '/my-education',
      verifyToken,
      userDevGuard,
      this.userEduController.allUserEducationForUser,
    );
    this.router.get(
      '/data/:eduId',
      verifyToken,
      userDevGuard,
      this.userEduController.userEduData,
    );
    this.router.get(
      '/all-education/:subsDataId',
      verifyToken,
      adminDevGuard,
      this.userEduController.allUserEducationForAdmin,
    );
  }
  getRouter(): Router {
    return this.router;
  }
}
