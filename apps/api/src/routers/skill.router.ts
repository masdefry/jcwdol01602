import { SkillController } from '@/controllers/skill.controller';
import { SkillScoreController } from '@/controllers/skillScore.controller';
import {
  devGuard,
  userDevGuard,
  verifyToken,
} from '@/middlewares/auth.middleware';
import { uploadImage } from '@/middlewares/multer';
import {
  skillQuestValidation,
  updateSkillQuestValidation,
} from '@/middlewares/skillQuest.validation';
import { Router } from 'express';

export class SkillRouter {
  private router: Router;
  private skillController: SkillController;
  private skillScoreController: SkillScoreController;

  constructor() {
    this.skillController = new SkillController();
    this.skillScoreController = new SkillScoreController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // All skill
    this.router.get('/all-skill', this.skillController.allSkill);

    // New Skill
    this.router.post(
      '/new',
      verifyToken,
      devGuard,
      this.skillController.newSkill,
    );

    // Delete Skill
    this.router.delete(
      '/:skillId',
      // verifyToken,
      // devGuard,
      this.skillController.deleteSkill,
    );

    this.router.post(
      '/new-question/:skillId',
      // verifyToken,
      // devGuard,
      uploadImage,
      skillQuestValidation,
      this.skillController.newSkillQuest,
    );

    this.router.patch(
      '/edit-question/:sQuestId',
      // verifyToken,
      // devGuard,
      uploadImage,
      updateSkillQuestValidation,
      this.skillController.updateSkillQuest,
    );

    this.router.get(
      '/all-question/:skillId',
      this.skillController.allSkillQuestBySkill,
    );

    this.router.post(
      '/submit-assestment/:skillId',
      verifyToken,
      userDevGuard,
      this.skillScoreController.newSkillScore,
    );
    this.router.delete(
      '/delete-score/:sScoreId',
      this.skillScoreController.deleteSkillScore,
    );
    this.router.get(
      '/all-scores',
      verifyToken,
      devGuard,
      this.skillScoreController.allSkillScore,
    );
    this.router.get(
      '/user-scores/:subsDataId',
      verifyToken,
      this.skillScoreController.subsDataSkillScore,
    );
  }
  getRouter(): Router {
    return this.router;
  }
}
