import { getSubsDataByUser } from '@/services/subsDataHandler';
import { getProfileBySubsData } from '@/services/userProfileHandler';
import { Response, Request, NextFunction } from 'express';
import { Account } from '@/custom';

export class UserProfileController {
  async profileBySubsData(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.account as Account;
      const profile = await getProfileBySubsData(user.id);
      return res.status(200).send({
        message: 'User profile retrieved successfully',
        profile,
      });
    } catch (error) {
      next(error);
    }
  }
}
