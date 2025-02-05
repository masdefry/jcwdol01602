import prisma from '@/prisma';
import { NextFunction, Request, Response } from 'express';
import { cloudinary, SECRET_KEY, WEB_URL } from '@/config';
import { genSalt, hash } from 'bcrypt';
import { AccountIdMaker } from '@/lib/customId';
import { transporter } from '@/lib/mail';
import path from 'path';
import handlebars from 'handlebars';
import fs from 'fs';
import { sign } from 'jsonwebtoken';
import { User } from '@/custom';

const findRole = async (name: string) => {
  const role = await prisma.role.findFirst({ where: { name } });
  return role;
};

const avatarUrl = cloudinary.url(
  'https://res.cloudinary.com/dnqgu6x1e/image/upload/avatar_default.jpg',
  {
    secure: true,
  },
);

export class RegisterController {
  // For testing cloudinary
  async cloudImg(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).send({
        message: 'Image retrevieved successfully',
        image: avatarUrl,
      });
    } catch (error) {
      next(error);
    }
  }

  async createUserAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;

      // Check if email already exist
      const findUser = await prisma.account.findUnique({
        where: { email },
      });
      if (findUser) {
        throw new Error('Email already exist');
      }

      // Convert plain password to hash
      const salt = await genSalt(10);
      const hashPassword = await hash(password, salt);

      // Get User Roles
      const role = await findRole('user');
      if (role === null) {
        throw new Error('Role not found');
      }

      // Make Custom Id
      const customId = await AccountIdMaker({ id: role.id, name: role.name });

      //   Create User Account
      const newAccount = await prisma.$transaction(async (prisma) => {
        const account = await prisma.account.create({
          data: {
            id: customId,
            name,
            email,
            password: hashPassword,
            avatar: avatarUrl,
            roleId: role.id,
          },
        });
        return account;
      });

      // Making payload for verification
      const payload = {
        email,
      };
      const token = sign(payload, SECRET_KEY as string, { expiresIn: '1hr' });

      // Specify the location of registerMail.hbs
      const templatePath = path.join(
        __dirname,
        '../templates',
        'registerMail.hbs',
      );
      const templateSource = await fs.readFileSync(templatePath, 'utf-8');
      const compiledTemplate = handlebars.compile(templateSource);

      // verification url
      const verificationUrl = WEB_URL + `/verify/${token}`;
      const html = compiledTemplate({
        name,
        email,
        verificationUrl,
      });

      // Send verification email to new user to disabled for another features
      await transporter.sendMail({
        to: email,
        subject: 'Registration',
        html,
      });

      return res.status(201).send({
        message: 'User account created successfully',
        user: newAccount,
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.user as User;

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
