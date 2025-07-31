import { Request, Response } from "express";
import { AchievementService } from "../../services/achievement.service";
import { PsnProfilesService } from "../../services/external/psn-profiles.service";

export class SyncAllAchievementsWithPsnController {
    private readonly achievementService: AchievementService;
    private readonly psnProfilesService: PsnProfilesService;

    constructor() {
        this.achievementService = new AchievementService();
        this.psnProfilesService = new PsnProfilesService();
    }

    async save(req: Request, res: Response): Promise<void> {
        const { gameUrl, gameId } = req.body;

        const psnAchievements = await this.psnProfilesService.getAchievementsFromPsn(gameUrl);
        const dbAchievements = await this.achievementService.listAllByGame({ id: gameId });

        if (!dbAchievements?.length) {
            const savedAchievements = [];

            for (let achievement of psnAchievements) {
                savedAchievements.push(await this.achievementService.manualSave(achievement, gameId));
            }

            res.json(savedAchievements);
            return;
        }

        for (let achievement of dbAchievements) {
            const psnAchievement = psnAchievements.find((ach) => ach.name.toLowerCase().trim() === achievement.name.toLowerCase().trim());

            if (!psnAchievement) {
                continue;
            }

            achievement.image = psnAchievement.image;
            achievement.percentageAchieved = psnAchievement.percentageAchieved;
            achievement.description = psnAchievement.description;
        }

        const updatedAchievements = await this.achievementService.editMultiple(dbAchievements);
        res.json(updatedAchievements);
    }
}
