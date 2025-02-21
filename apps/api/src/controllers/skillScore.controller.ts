import { Request, Response, NextFunction } from 'express';
import { Account } from '@/custom';
import {
  addSkillScore,
  delSkillScore,
  getSkillScoreAll,
  getSkillScoreBySubsData,
} from '@/services/skillScoreHandler';

export class SkillScoreController {
  async newSkillScore(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.account as Account;
      const { skillId } = req.params;
      if (!skillId) throw new Error('Skill Id required');
      const { answers } = req.body;
      if (!answers) throw new Error('Input needed');
      if (user.role !== 'user') {
        throw new Error('Unauthorized');
      }
      const scoreData = await addSkillScore(user.id, skillId, answers);
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
      const deletedSScore = await delSkillScore(sScoreId);
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
  async subsDataSkillScore(req: Request, res: Response, next: NextFunction) {
    try {
      const { subsDataId } = req.params;
      if (!subsDataId) {
        throw new Error(`Subsription data id required`);
      }
      let skillScore = null;
      skillScore = await getSkillScoreBySubsData(subsDataId);
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
