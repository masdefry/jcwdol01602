import { NextFunction, Request, Response } from 'express';
import {
  delAccHandler,
  getAccAllHandler,
  getAccById,
  loginAccHandler,
  verifyAccHandler,
} from '@/services/accountHandler';
import addAccHandler from '@/services/newAccount';
import { Account } from '@/custom';

export class AccountController {
  async newUser(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        name,
        email,
        password,
        retypePass,
        pob,
        dobString,
        genderName,
        address,
        eduLevelName,
        school,
        discipline,
        beginDate,
        finishDate,
      } = req.body;

      // use function createNewAccount to shorten the code
      const newUser = await addAccHandler(
        name,
        email,
        password,
        retypePass,
        'user',
        pob,
        dobString,
        genderName,
        address,
        eduLevelName,
        school,
        discipline,
        beginDate,
        finishDate,
      );

      return res.status(201).send({
        message: 'User account created successfully',
        user: newUser,
      });
    } catch (error) {
      next(error);
    }
  }

  async newAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, retypePass } = req.body;
      const newAdmin = await addAccHandler(
        name,
        email,
        password,
        retypePass,
        'admin',
      );

      return res.status(201).send({
        message: 'Admin account created successfully',
        user: newAdmin,
      });
    } catch (error) {
      next(error);
    }
  }

  async newDev(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, retypePass } = req.body;
      const newDev = await addAccHandler(
        name,
        email,
        password,
        retypePass,
        'developer',
      );

      return res.status(201).send({
        message: 'Developer account created successfully',
        user: newDev,
      });
    } catch (error) {
      next(error);
    }
  }

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
    } catch (error) {
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
}
