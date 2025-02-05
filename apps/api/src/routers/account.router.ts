import { AccountController } from '@/controllers/account.controller';
import { RegisterController } from '@/controllers/register.controller';
import {
  LoginValidation,
  RegisterValidation,
} from '@/middlewares/account.validation';
import { verifyToken } from '@/validations/auth.middleware';
import { Router } from 'express';

export class AccountRouter {
  private router: Router;
  private registerController: RegisterController;
  private accountController: AccountController;

  constructor() {
    this.registerController = new RegisterController();
    this.accountController = new AccountController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/image', this.registerController.cloudImg);
    this.router.post(
      '/register',
      RegisterValidation,
      this.registerController.createUserAccount,
    );
    this.router.post(
      '/login',
      LoginValidation,
      this.accountController.loginAccount,
    );
    this.router.get(
      '/verify',
      verifyToken,
      this.registerController.verifyAccount,
    );
    this.router.delete('/:id', this.registerController.deleteAccount);
  }

  getRouter(): Router {
    return this.router;
  }
}
