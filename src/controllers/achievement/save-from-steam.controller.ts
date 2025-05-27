import { Request, Response } from "express";
import { AchievementService } from "../../services/achievement.service";

export class SaveFromSteamController {
    private readonly achievementService: AchievementService;

    constructor() {
        this.achievementService = new AchievementService();
    }

    async save(req: Request, res: Response): Promise<void> {
        const game = req.body;

        const achievementsSaved = await this.achievementService.saveFromSteam(game);

        res.json(achievementsSaved);
    }
}
