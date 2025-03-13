import { Request, Response, NextFunction } from 'express';
import { Account } from '@/custom';
import {
  addWorkerUser,
  delUserWorker,
  editWorkUser,
  verifyUserWorker,
} from '@/services/workerHandler';
import {
  getAllWorkerByCompany,
  getAllWorkerByUser,
  getWorkerById,
} from '@/services/workerGet';
import { getSubsDataByUser } from '@/services/subsDataHandler';

export class WorkerController {
  async newWorkerUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.account as Account;
      const { companyName, position, beginDate, finishDate, desc } = req.body;
      if (!companyName || !position || !beginDate)
        throw new Error(`Please complete your data`);
      const worker = await addWorkerUser(
        user.id,
        companyName,
        position,
        beginDate,
        finishDate,
        desc,
      );
      return res.status(201).send({
        message: 'Work experience added successfully',
        worker,
      });
    } catch (error) {
      next(error);
    }
  }

  async workerByCompany(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = req.account as Account;
      let allWorkerCompany = null;
      allWorkerCompany = await getAllWorkerByCompany(admin.id);
      if (allWorkerCompany.length === 0) {
        allWorkerCompany = `No data`;
      }
      return res.status(200).send({
        message: `Worker by company retreived successfully`,
        allWorkerCompany,
      });
    } catch (error) {
      next(error);
    }
  }

  async workerByUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.account as Account;
      let userWorker = null;
      userWorker = await getAllWorkerByUser(user.id);
      if (userWorker.length === 0) {
        userWorker = 'No data';
      }
      return res.status(200).send({
        message: `User working data verified successfully`,
        userWorker,
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyWork(req: Request, res: Response, next: NextFunction) {
    try {
      const { isVerified } = req.body;
      const { workerId } = req.params;
      if (!workerId) throw new Error(`Worker id required`);
      if (typeof isVerified !== 'boolean')
        throw new Error(`Invalid input, only boolean allowed`);
      const userWorker = await verifyUserWorker(workerId, isVerified);
      return res.status(200).send({
        message: `User working data verified successfully`,
        userWorker,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteWorkerUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.account as Account;
      const { workerId } = req.params;
      if (!workerId) throw new Error(`Worker Id required`);
      const userWork = await delUserWorker(user.id, workerId);
      return res.status(200).send({
        message: `User work experience deleted successfully`,
        userWork,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateWorkerUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.account as Account;
      const { workerId } = req.params;
      const { companyName, position, beginDate, finishDate, desc } = req.body;
      if (!workerId) throw new Error(`Worker Id required`);
      const worker = await editWorkUser(
        user.id,
        workerId,
        companyName,
        position,
        beginDate,
        finishDate,
        desc,
      );
      return res.status(201).send({
        message: 'Work experience updated successfully',
        worker,
      });
    } catch (error) {
      next(error);
    }
  }

  async workerData(req: Request, res: Response, next: NextFunction) {
    try {
      const { workerId } = req.params;
      let work = await getWorkerById(workerId);
      return res.status(200).send({
        message: 'Worker experience retrieved successfully',
        work,
      });
    } catch (error) {
      next(error);
    }
  }
}
