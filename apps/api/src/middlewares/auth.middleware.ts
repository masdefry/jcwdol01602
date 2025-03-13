import { Request, Response, NextFunction } from 'express';
import { SECRET_KEY } from '@/config';
import { verify } from 'jsonwebtoken';
import { Account } from '@/custom';
import prisma from '@/prisma';

async function verifyToken(req: Request, res: Response, next: NextFunction) {
  try {
    console.log(`verifyToken called`);
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log(`token - ${token}`);
    if (!token) throw new Error('Unauthorized');
    const decoded = verify(token, SECRET_KEY as string);
    if (!decoded) throw new Error('Unauthorized');

    // Convert payload to matching data type
    const account = decoded as Account;
    req.account = account;

    // Check if logged user exist in db
    const findAccount = await prisma.account.findUnique({
      where: { id: account.id },
    });
    if (!findAccount) throw new Error('Who are you?!');
    console.log(`verifyToken finished`);
    next();
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return res.status(401).send({ message: error.message });
    }

    // Handle error if token has expired
    if (error.name === 'TokenExpiredError') {
      return res.status(401).send({
        message: 'Your token has expired. Please relogin',
      });
    }
    next(error);
  }
}

async function userDevGuard(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.account?.role !== 'user' && req.account?.role !== 'developer') {
      return res.status(403).send({ message: 'Forbidden' });
    }
    next();
  } catch (error) {
    next(error);
  }
}

async function adminDevGuard(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.account?.role !== 'admin' && req.account?.role !== 'developer') {
      return res.status(403).send({ message: 'You are not an Admin' });
    }
    next();
  } catch (error) {
    next(error);
  }
}

async function devGuard(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.account?.role !== 'developer') {
      return res.status(403).send({ message: 'You are not a developer' });
    }
    next();
  } catch (error) {
    next(error);
  }
}

export { verifyToken, userDevGuard, adminDevGuard, devGuard };
