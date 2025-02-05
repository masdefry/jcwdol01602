import prisma from '@/prisma';
import { NextFunction, Request, Response } from 'express';
import { cloudinary, SECRET_KEY, WEB_URL } from '@/config';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Account } from '@/custom';
import createNewAccount from '@/lib/newAccount';

export class AccountController {
  async createUserAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;

      // use function createNewAccount to shorten the code
      const newUser = await createNewAccount(name, email, password, 'user');

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
      const { name, email, password } = req.body;
      const newAdmin = await createNewAccount(name, email, password, 'admin');

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
      const { name, email, password } = req.body;
      const newDev = await createNewAccount(name, email, password, 'developer');

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

      // Check if email exist in database and verified
      const findAccount = await prisma.account.findUnique({
        where: { email },
        include: {
          role: {
            select: {
              name: true,
            },
          },
        },
      });
      if (!findAccount) throw new Error('Invalid email!');
      if (!findAccount.isVerified)
        throw new Error('Please verify your account first');

      // Compare password with salt and check if password is valid
      const validPassword = await compare(password, findAccount.password);
      if (!validPassword) throw new Error('Invalid password!');

      // Use JWT
      const payload = {
        email,
        id: findAccount.id,
        name: findAccount.name,
        role: findAccount.role.name,
        avatar: findAccount.avatar,
      };
      const token = sign(payload, SECRET_KEY as string, { expiresIn: '1h' });

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
      // check if id not available
      if (!id) {
        throw new Error('Id not available');
      }
      // Check if account exist
      const findAccount = await prisma.account.findUnique({
        where: { id },
      });
      if (!findAccount) throw new Error('Account not found');

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
      return res.status(201).send({
        message: `${findAccount.name} deleted successfully`,
      });
    } catch (error) {
      next(error);
    }
  }
}
