import { SkillController } from '@/controllers/skill.controller';
import { devGuard, verifyToken } from '@/middlewares/auth.middleware';
import { uploadImage } from '@/middlewares/multer';
import {
  skillQuestValidation,
  updateSkillQuestValidation,
} from '@/middlewares/skillQuest.validation';
import { Router } from 'express';

export class SkillRouter {
  private router: Router;
  private skillController: SkillController;

  constructor() {
    this.skillController = new SkillController();
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
  }
  getRouter(): Router {
    return this.router;
  }
}
