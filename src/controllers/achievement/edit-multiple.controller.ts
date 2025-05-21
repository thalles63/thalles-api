import { Request, Response } from "express";
import { AchievementService } from "../../services/achievement.service";

export class EditMultipleAchievementsController {
    private readonly achievementService: AchievementService;

    constructor() {
        this.achievementService = new AchievementService();
    }

    async editMultiple(req: Request, res: Response): Promise<void> {
        const achievements = req.body;

        const updatedAchievements = [];
        for (let achievement of achievements) {
            updatedAchievements.push(await this.achievementService.edit(achievement.id, achievement));
        }

        res.json(updatedAchievements);
    }
}
