import { SECRET_KEY } from '@/config';
import prisma from '@/prisma';
import { compare } from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import { sign } from 'jsonwebtoken';

export class AccountController {
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
}
