import { Request, Response } from "express";
import { AchievementService } from "../../services/achievement.service";
import { PsnProfilesService } from "../../services/external/psn-profiles.service";

export class SaveFromPsnController {
    private readonly achievementService: AchievementService;
    private readonly psnProfilesService: PsnProfilesService;

    constructor() {
        this.achievementService = new AchievementService();
        this.psnProfilesService = new PsnProfilesService();
    }

    async save(req: Request, res: Response): Promise<void> {
        const { gameUrl, gameId } = req.body;

        const achievements = await this.psnProfilesService.getAchievementsFromPsn(gameUrl);

        const savedAchievements = [];
        for (let achievement of achievements) {
            savedAchievements.push(await this.achievementService.manualSave(achievement, gameId));
        }

        res.json(savedAchievements);
    }
}
