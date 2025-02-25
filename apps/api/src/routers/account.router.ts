import { AccountController } from '@/controllers/account.controller';
import { RegisterController } from '@/controllers/register.controller';
import {
  LoginValidation,
  RegisterValidation,
} from '@/middlewares/account.validation';
import { verifyToken } from '@/middlewares/auth.middleware';
import { uploadImage } from '@/middlewares/multer';
import { Router } from 'express';

export class AccountRouter {
  private router: Router;
  private accountController: AccountController;
  private registerController: RegisterController;

  constructor() {
    this.accountController = new AccountController();
    this.registerController = new RegisterController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // New user account
    this.router.post(
      '/new-user',
      RegisterValidation,
      this.registerController.newUser,
    );
    // New admin account
    this.router.post(
      '/new-admin',
      RegisterValidation,
      this.registerController.newAdmin,
    );
    // New dev account
    this.router.post(
      '/new-dev',
      RegisterValidation,
      this.registerController.newDev,
    );
    // login
    this.router.post(
      '/login',
      LoginValidation,
      this.accountController.loginAccount,
    );
    // get all accounts
    this.router.get('/all-accounts', this.accountController.allAccount);
    // verify account
    this.router.post(
      '/verify',
      verifyToken,
      this.accountController.verifyAccount,
    );
    // delete account
    this.router.delete(
      '/delete/:accountId',
      // verifyToken,
      this.accountController.deleteAccount,
    );
    // get account by Id
    this.router.get('/:id', verifyToken, this.accountController.findAccount);

    // upload avatar
    this.router.patch(
      '/upload-avatar',
      uploadImage,
      verifyToken,
      this.accountController.uploadAvatar,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
