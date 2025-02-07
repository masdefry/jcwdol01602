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
      '/newUser',
      RegisterValidation,
      this.AccountController.createUserAccount,
    );
    // New admin account
    this.router.post(
      '/newAdmin',
      RegisterValidation,
      this.AccountController.createAdminAccount,
    );
    // New dev account
    this.router.post(
      '/newDev',
      RegisterValidation,
      this.AccountController.createDevAccount,
    );
    // login
    this.router.post(
      '/login',
      LoginValidation,
      this.AccountController.loginAccount,
    );
    // get all accounts
    this.router.get('/getAllAccounts', this.AccountController.getAccounts);
    // verify account
    this.router.post(
      '/verify',
      verifyToken,
      this.AccountController.verifyAccount,
    );
    // delete account
    this.router.delete('/:id', this.AccountController.deleteAccount);
    // get account by Id
    this.router.get('/:id', verifyToken, this.AccountController.getAccountById);
  }

  getRouter(): Router {
    return this.router;
  }
}
