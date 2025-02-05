import { Request, Response, NextFunction } from 'express';
import { SECRET_KEY } from '@/config';
import { verify } from 'jsonwebtoken';
import { User } from '@/custom';

async function verifyToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error('Unauthorized');
    const user = verify(token, SECRET_KEY as string);
    if (!user) throw new Error('Unauthorized');

    req.user = user as User;
    next();
  } catch (error) {
    next(error);
  }
}

export { verifyToken };
