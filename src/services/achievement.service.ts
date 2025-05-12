import { Repository } from "typeorm";
import { appDataSource } from "../config/database.config";
import { Achievement } from "../entities/achievements.entity";
import { Game } from "../entities/games.entity";
import { NotFoundError } from "../utils/errors/errors";
import { PlayStationService } from "./external/playstation.service";

export class AchievementService {
    private readonly achievementRepository: Repository<Achievement>;
    private readonly playstationService: PlayStationService;

    constructor() {
        this.achievementRepository = appDataSource.getRepository(Achievement);
        this.playstationService = new PlayStationService();
    }

    async saveFromPsn(game: Partial<Game>) {
        try {
            const trophies = await this.playstationService.getListOfTrophies(<Game>game);

            const achievementsList: Achievement[] = [];
            for (const trophy of trophies) {
                const newAchievement = this.achievementRepository.create({
                    gameId: game.id,
                    platformId: trophy.trophyId.toString(),
                    description: trophy.trophyDetail,
                    image: trophy.trophyIconUrl,
                    name: trophy.trophyName,
                    type: trophy.trophyType,
                    isAchieved: false,
                    percentageAchieved: 0
                });
                achievementsList.push(newAchievement);
            }

            return await this.achievementRepository.save(achievementsList);
        } catch (error) {
            throw new Error(`Failed to save achievements: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    async listAllByGame(game: Partial<Game>) {
        const achievements = await this.achievementRepository.find({
            where: { gameId: game.id }
        });

        return achievements;
    }

    async updateAchievements(achievementsUpdated: Partial<Achievement>[], gameId: string): Promise<Achievement[] | null> {
        try {
            if (!achievementsUpdated) {
                return null;
            }

            const achievementsToUpdate = await this.achievementRepository.find({
                where: { gameId: gameId, isAchieved: false }
            });

            const achievementsList: Achievement[] = [];
            for (const achievementUpdated of achievementsUpdated) {
                const achievement = achievementsToUpdate.find((a) => a.platformId === achievementUpdated.platformId);

                if (!achievement) {
                    continue;
                }

                Object.assign(achievement, achievementUpdated);
                achievementsList.push(achievement);
            }

            return await this.achievementRepository.save(achievementsList);
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new Error(`Failed to edit game: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
}
