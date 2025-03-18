import { Account } from '@/custom';
import {
  addCvHandler,
  delCVHandler,
  getCvById,
  getCvByUser,
} from '@/services/cvHandler';
import {
  getSubsDataByUser,
  selectSubsDataCv,
} from '@/services/subsDataHandler';
import { Request, Response, NextFunction } from 'express';

export class CvController {
  async addCv(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.account as Account;
      if (user.role !== 'user') throw new Error(`You are not a jobseeker`);
      const file = req.file;
      if (!file) throw new Error(`CV File required`);
      const uploadCv = await addCvHandler(user.id, file);
      return res.status(200).send({
        message: 'CV uploaded successfully',
        uploadCv,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCv(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.account as Account;
      const { cvId } = req.params;
      if (!cvId) throw new Error(`CV Id required`);
      const deletedCv = await delCVHandler(user.id, cvId);
      return res.status(200).send({
        message: `CV deleted successfully`,
        deletedCv,
      });
    } catch (error) {
      next(error);
    }
  }

  async selectedCv(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.account as Account;
      const { cvId } = req.params;
      if (!cvId) throw new Error(`CV Id required`);
      const subsData = await getSubsDataByUser(user.id);
      if (!subsData) throw new Error(`No subscription data exist`);
      const findCv = await getCvById(cvId);
      if (!findCv) throw new Error(`CV data doesn't exist`);
      const updateSubsData = await selectSubsDataCv(subsData.id, findCv.id);
      return res.status(200).send({
        message: `CV selected successfully`,
        updateSubsData,
      });
    } catch (error) {
      next(error);
    }
  }

  async userCvDatas(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.account as Account;
      const cvDatas = await getCvByUser(user.id);
      return res.status(200).send({
        message: `CV datas retrieved successfully`,
        cvDatas,
      });
    } catch (error) {
      next(error);
    }
  }
}
