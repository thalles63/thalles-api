import { Request, Response } from "express";
import { Achievement } from "../../entities/achievements.entity";
import { Game } from "../../entities/games.entity";
import { AchievementService } from "../../services/achievement.service";
import { CloudinaryService } from "../../services/external/cloudinary.service";
import { PsnProfilesService } from "../../services/external/psn-profiles.service";

export class SyncAllAchievementsWithPsnController {
    private readonly achievementService: AchievementService;
    private readonly psnProfilesService: PsnProfilesService;
    private readonly cloudinaryService: CloudinaryService;

    constructor() {
        this.achievementService = new AchievementService();
        this.psnProfilesService = new PsnProfilesService();
        this.cloudinaryService = new CloudinaryService();
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

            this.updateGameImagesAsync(gameId, savedAchievements);
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

        if (updatedAchievements?.length) {
            this.updateGameImagesAsync(gameId, updatedAchievements);
        }

        res.json(updatedAchievements);
    }

    private updateGameImagesAsync(gameId: string, achievementsToSave: Achievement[]) {
        this.cloudinaryService
            .migrateAchievementImages(<Game>{ id: gameId, achievements: achievementsToSave })
            .then(({ achievements }) => {
                this.achievementService.updateAchievements(achievements, gameId);
            })
            .catch((err) => console.error("Erro ao migrar imagens:", err));
    }
}
