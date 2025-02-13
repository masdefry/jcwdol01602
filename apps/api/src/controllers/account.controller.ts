import prisma from '@/prisma';
import { NextFunction, Request, Response } from 'express';
import { cloudinary, SECRET_KEY } from '@/config';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Account } from '@/custom';
import createNewAccount from '@/lib/newAccount';
import { login } from '@/services/accountHandler';

export class AccountController {
  async createUserAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, retypePass } = req.body;

      // use function createNewAccount to shorten the code
      const newUser = await createNewAccount(
        name,
        email,
        password,
        retypePass,
        'user',
      );

      return res.status(201).send({
        message: 'User account created successfully',
        user: newUser,
      });
    } catch (error) {
      next(error);
    }
  }

  async createAdminAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, retypePass } = req.body;
      const newAdmin = await createNewAccount(
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

  async createDevAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, retypePass } = req.body;
      const newDev = await createNewAccount(
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
      const token = await login(email, password);

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

      await prisma.account.update({
        where: { email },
        data: {
          isVerified: true,
        },
      });
      res.status(200).send({
        message: 'Verification Success',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      // const account = req.account as Account;

      // check if id not available
      if (!id) {
        throw new Error('Id not available');
      }
      // Check if account exist
      const findAccount = await prisma.account.findUnique({
        where: { id },
      });
      if (!findAccount) throw new Error('Account not found');

      // Check if id Token match with account
      // if (account.id !== findAccount.id) throw new Error('Unauthorized');

      // Delete avatar from cloudinary
      const publicIdMatch = findAccount.avatar.match(
        /final-project\/avatar\/(.+)\.[a-z]+$/,
      );
      if (publicIdMatch) {
        const publicId = `final-project/avatar/${publicIdMatch[1]}`;
        await cloudinary.uploader.destroy(publicId);
      }

      // Delete account
      await prisma.account.delete({
        where: { id },
      });
      return res.status(200).send({
        message: `${findAccount.name} deleted successfully`,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAccountById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        throw new Error('Id not available');
      }
      // Check if account exist
      const findAccount = await prisma.account.findUnique({
        where: { id },
      });
      if (!findAccount) throw new Error('Account not found');
      return res.status(200).send({
        message: 'Account retreived successfully',
        account: findAccount,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAccounts(req: Request, res: Response, next: NextFunction) {
    try {
      const accounts = await prisma.account.findMany({
        select: { id: true, name: true, email: true, avatar: true },
      });
      if (accounts.length === 0) {
        return res.status(200).send({ message: 'No data', accounts });
      }
      return res.status(200).send({
        message: 'Accounts retreived successfully',
        accounts: accounts,
      });
    } catch (error) {
      next(error);
    }
  }
}
