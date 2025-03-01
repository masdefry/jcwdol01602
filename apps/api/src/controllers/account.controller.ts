import { NextFunction, Request, Response } from 'express';
import {
  addAccAvatar,
  delAccHandler,
  getAccAllHandler,
  getAccById,
  loginAccHandler,
  verifyAccHandler,
} from '@/services/accountHandler';
import addAccHandler from '@/services/newAccount';
import { Account } from '@/custom';
import { Gender } from '@prisma/client';

export class AccountController {
  async loginAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      // Get token from login
      const token = await loginAccHandler(email, password);

      return res.status(200).cookie('access_token', token).send({
        message: 'Login success',
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.account as Account;
      await verifyAccHandler(email);
      res.status(200).send({
        message: 'Verification Success',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAccount(req: Request, res: Response, next: NextFunction) {
    try {
      // const account = req.account as Account;
      const { accountId } = req.params;

      const deletedAccount = await delAccHandler(accountId);

      return res.status(200).send({
        message: `your account deleted successfully`,
        deletedAccount,
      });
    } catch (error: any) {
      if (error.message) return res.status(404).send(error.message);
      next(error);
    }
  }

  async findAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        throw new Error('Id not available');
      }
      const getAccount = await getAccById(id);
      if (!getAccount) throw new Error('Account not found');
      return res.status(200).send({
        message: 'Account retreived successfully',
        account: getAccount,
      });
    } catch (error) {
      next(error);
    }
  }

  async allAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const datas = await getAccAllHandler();
      if (datas.length === 0) {
        return res.status(200).send({ message: 'No data', accounts: datas });
      }
      return res.status(200).send({
        message: 'Accounts retreived successfully',
        accounts: datas,
      });
    } catch (error) {
      next(error);
    }
  }

  async uploadAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      const account = req.account as Account;
      const image = req.file;
      if (!image) throw new Error(`Image required`);
      const upAvatar = await addAccAvatar(account.id, image);
      return res.status(200).send({
        message: `Avatar uploaded successfully`,
        updateAccount: upAvatar,
      });
    } catch (error) {
      next(error);
    }
  }

  async userGender(req: Request, res: Response, next: NextFunction) {
    try {
      const gender = Object.values(Gender);
      return res.status(200).send({
        message: `Gender retrieved successfully`,
        gender,
      });
    } catch (error) {
      next(error);
    }
  }
}
