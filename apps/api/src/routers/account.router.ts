import { AccountController } from '@/controllers/account.controller';
import {
  LoginValidation,
  RegisterValidation,
} from '@/middlewares/account.validation';
import { verifyToken } from '@/validations/auth.middleware';
import { Router } from 'express';

export class AccountRouter {
  private router: Router;
  private AccountController: AccountController;

  constructor() {
    this.AccountController = new AccountController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/newUser',
      RegisterValidation,
      this.AccountController.createUserAccount,
    );
    this.router.post(
      '/newAdmin',
      RegisterValidation,
      this.AccountController.createAdminAccount,
    );
    this.router.post(
      '/newDev',
      RegisterValidation,
      this.AccountController.createDevAccount,
    );
    this.router.post(
      '/login',
      LoginValidation,
      this.AccountController.loginAccount,
    );
    this.router.get(
      '/verify',
      verifyToken,
      this.AccountController.verifyAccount,
    );
    this.router.delete('/:id', this.AccountController.deleteAccount);
  }

  getRouter(): Router {
    return this.router;
  }
}
