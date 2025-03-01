import { Request, Response, NextFunction } from 'express';
import { Account } from '@/custom';
import {
  addSkillScore,
  allSkillScoreByUserSkill,
  delSkillScore,
  getSkillScoreAll,
} from '@/services/skillScoreHandler';

export class SkillScoreController {
  async newSkillScore(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.account as Account;
      const { uSkillId } = req.params;
      if (!uSkillId) throw new Error('User skill Id required');
      const { skillId, answers } = req.body;
      if (!skillId && !answers) throw new Error('Input needed');
      if (user.role !== 'user') {
        throw new Error('Unauthorized');
      }
      const scoreData = await addSkillScore(
        user.id,
        uSkillId,
        skillId,
        answers,
      );
      return res.status(200).send({
        message: `Answer submitted successfully`,
        skillScore: scoreData,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteSkillScore(req: Request, res: Response, next: NextFunction) {
    try {
      const { sScoreId } = req.params;
      if (!sScoreId) throw new Error(`Skill score id required`);
      const user = req.account as Account;
      const deletedSScore = await delSkillScore(user.id, sScoreId);
      return res.status(200).send({
        message: `Score data deleted successfully`,
        sScore: deletedSScore,
      });
    } catch (error) {
      next(error);
    }
  }
  async allSkillScore(req: Request, res: Response, next: NextFunction) {
    try {
      let skillScore = null;
      skillScore = await getSkillScoreAll();
      if (skillScore.length === 0) {
        skillScore = 'No data';
      }
      return res
        .status(200)
        .send({ message: `Skill scores retrieved successfully`, skillScore });
    } catch (error) {
      next(error);
    }
  }
  async skillScoreByUserSkill(req: Request, res: Response, next: NextFunction) {
    try {
      const { uSkillId } = req.params;
      if (!uSkillId) {
        throw new Error(`User skill id required`);
      }
      let skillScore = null;
      skillScore = await allSkillScoreByUserSkill(uSkillId);
      if (skillScore.length === 0) {
        skillScore = `No data`;
      }
      return res
        .status(200)
        .send({ message: `Skill scores retrieved successfully`, skillScore });
    } catch (error) {
      next(error);
    }
  }
}
