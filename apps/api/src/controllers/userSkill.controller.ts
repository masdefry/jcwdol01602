import { Account } from '@/custom';
import { addUserSkill, delUserSkill } from '@/services/userSkillHandler';
import { Request, Response, NextFunction } from 'express';

export class UserSkillController {
  async newUserSkill(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.account as Account;
      const { skillName } = req.body;
      if (!skillName) throw new Error(`Skill name required`);
      const userSkill = await addUserSkill(user.id, skillName);
      return res.status(200).send({
        message: 'User skill added successfully',
        userSkill,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUserSkill(req: Request, res: Response, next: NextFunction) {
    try {
      const { uSkillId } = req.params;
      if (!uSkillId) throw new Error(`User skill id required`);
      const user = req.account as Account;
      const deleteUserSkill = await delUserSkill(user.id, uSkillId);
      return res.status(200).send({
        message: `User skill deleted successfully`,
        deleteUserSkill,
      });
    } catch (error) {
      next(error);
    }
  }
}
