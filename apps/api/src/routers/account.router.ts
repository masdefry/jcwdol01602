import { AccountController } from '@/controllers/account.controller';
import {
  LoginValidation,
  RegisterValidation,
} from '@/middlewares/account.validation';
import { verifyToken } from '@/middlewares/auth.middleware';
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
    // New user account
    this.router.post(
      '/new-user',
      RegisterValidation,
      this.AccountController.newUser,
    );
    // New admin account
    this.router.post(
      '/new-admin',
      RegisterValidation,
      this.AccountController.newAdmin,
    );
    // New dev account
    this.router.post(
      '/new-dev',
      RegisterValidation,
      this.AccountController.newDev,
    );
    // login
    this.router.post(
      '/login',
      LoginValidation,
      this.AccountController.loginAccount,
    );
    // get all accounts
    this.router.get('/all-accounts', this.AccountController.allAccount);
    // verify account
    this.router.post(
      '/verify',
      verifyToken,
      this.AccountController.verifyAccount,
    );
    // delete account
    this.router.delete(
      '/delete/:accountId',
      // verifyToken,
      this.AccountController.deleteAccount,
    );
    // get account by Id
    this.router.get('/:id', verifyToken, this.AccountController.findAccount);
  }

  getRouter(): Router {
    return this.router;
  }
}
