import { Account } from '@/custom';
import { getSubsDataById, getSubsDataByUser } from '@/services/subsDataHandler';
import {
  addUserEdu,
  allUserEduBySubsData,
  delUserEdu,
  editUserEdu,
} from '@/services/userEduHandler';
import { Request, Response, NextFunction } from 'express';

export class UserEduController {
  async moreEducation(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.account as Account;
      const { eduLevelName, school, discipline, beginDate, finishDate, desc } =
        req.body;
      if (!eduLevelName || !school || !discipline || !beginDate) {
        throw new Error(`Please complete your education data`);
      }
      const subsData = await getSubsDataByUser(user.id);
      if (!subsData) throw new Error(`Subscription data does't exist`);
      const userEdu = await addUserEdu(
        subsData.id,
        eduLevelName,
        school,
        discipline,
        beginDate,
        finishDate,
        desc,
      );
      return res.status(201).send({
        message: 'New education added successfully',
        userEdu,
      });
    } catch (error) {
      next(error);
    }
  }
  async updateEducation(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.account as Account;
      const { eduId } = req.params;
      if (!eduId) throw new Error(`Education id required`);
      const { eduLevelName, school, discipline, beginDate, finishDate, desc } =
        req.body;
      const updateUserEdu = await editUserEdu(
        user.id,
        eduId,
        eduLevelName,
        school,
        discipline,
        beginDate,
        finishDate,
        desc,
      );
      return res.status(200).send({
        message: `Education updated successfully`,
        updateUserEdu,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteEducation(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.account as Account;
      const { eduId } = req.params;
      const deletedEducation = await delUserEdu(user.id, eduId);
      return res.status(200).send({
        message: `Education deleted successfully`,
        deletedEducation,
      });
    } catch (error) {
      next(error);
    }
  }

  async allUserEducationForUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = req.account as Account;
      const subsData = await getSubsDataByUser(user.id);
      if (!subsData) throw new Error(`Subscription data doesn't exits`);
      let allUserEdu = null;
      allUserEdu = await allUserEduBySubsData(subsData.id);
      if (allUserEdu.length === 0) {
        allUserEdu = `No data`;
      }
      return res.status(200).send({
        message: `All user education retrieved successfully`,
        allUserEdu,
      });
    } catch (error) {
      next(error);
    }
  }

  async allUserEducationForAdmin(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { subsDataId } = req.params;
      if (!subsDataId) throw new Error(`Subscription data required`);
      const subsData = await getSubsDataById(subsDataId);
      if (!subsData) throw new Error(`Subscription data doesn't exits`);
      let allUserEdu = null;
      allUserEdu = await allUserEduBySubsData(subsData.id);
      if (allUserEdu.length === 0) {
        allUserEdu = 'No data';
      }
      return res.status(200).send({
        message: `All user education retrieved successfully`,
        allUserEdu,
      });
    } catch (error) {
      next(error);
    }
  }
}
