import { RoleController } from '@/controllers/role.controller';
import { RoleValidation } from '@/middlewares/role.validation';
import { Router } from 'express';

export class RoleRouter {
  private router: Router;
  private roleController: RoleController;

  constructor() {
    this.roleController = new RoleController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/', RoleValidation, this.roleController.createRole);
    this.router.get('/', this.roleController.getRoles);
    this.router.delete('/:id', this.roleController.deleteRole);
  }

  getRouter(): Router {
    return this.router;
  }
}
