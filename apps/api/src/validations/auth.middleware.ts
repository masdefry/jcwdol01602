import { Request, Response, NextFunction } from 'express';
import { SECRET_KEY } from '@/config';
import { verify } from 'jsonwebtoken';
import { Account } from '@/custom';

async function verifyToken(req: Request, res: Response, next: NextFunction) {
  try {
    console.log(`verifying token for path ${req.path}`);
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error('Unauthorized');
    const account = verify(token, SECRET_KEY as string);
    if (!account) throw new Error('Unauthorized');

    req.account = account as Account;
    next();
  } catch (error) {
    res.status(401).send({ message: 'Unauthorized' });
  }
}

export { verifyToken };
