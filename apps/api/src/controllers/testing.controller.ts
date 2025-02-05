import { Request, Response, NextFunction } from 'express';
import prisma from '@/prisma';

export class TestController {
  async getTestingRouter(req: Request, res: Response) {
    return res.status(200).send({
      message: 'Testing Router',
    });
  }
}
