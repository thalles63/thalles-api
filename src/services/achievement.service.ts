import { Repository } from "typeorm";
import { appDataSource } from "../config/database.config";
import { Achievement } from "../entities/achievements.entity";
import { Game } from "../entities/games.entity";
import { NotFoundError, ValidationError } from "../utils/errors/errors";
import { PlayStationService } from "./external/playstation.service";
import { SteamService } from "./external/steam.service";
import { XboxService } from "./external/xbox.service";

export class AchievementService {
    private readonly achievementRepository: Repository<Achievement>;
    private readonly playstationService: PlayStationService;
    private readonly xboxService: XboxService;
    private readonly steamService: SteamService;

    constructor() {
        this.achievementRepository = appDataSource.getRepository(Achievement);
        this.playstationService = new PlayStationService();
        this.xboxService = new XboxService();
        this.steamService = new SteamService();
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

    async saveFromXbox(game: Partial<Game>) {
        try {
            const achievements = await this.xboxService.getListOfAchievements(<Game>game);

            const achievementsList: Achievement[] = [];
            for (const achievement of achievements) {
                const newAchievement = this.achievementRepository.create({
                    gameId: game.id,
                    platformId: achievement.id,
                    description: achievement.description,
                    image: "",
                    name: achievement.name,
                    type: achievement.rewards?.length ? achievement.rewards[0].value : "",
                    isAchieved: achievement.progressState === "Achieved",
                    dateAchieved: achievement.progressState === "Achieved" ? achievement.progression.timeUnlocked : undefined,
                    percentageAchieved: 0
                });

                achievementsList.push(newAchievement);
            }

            return await this.achievementRepository.save(achievementsList);
        } catch (error) {
            throw new Error(`Failed to save achievements: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    async saveFromSteam(game: Partial<Game>) {
        try {
            const achievements = await this.steamService.getListOfAchievements(<Game>game);
            const achievementPercentages = await this.steamService.getAchievementPercentages(game.platformId!);

            const achievementsList: Achievement[] = [];
            for (const achievement of achievements) {
                const percentage = achievementPercentages.find((p) => p.name === achievement.platformId)?.percent;
                const newAchievement = this.achievementRepository.create({
                    gameId: game.id,
                    platformId: achievement.platformId,
                    description: achievement.description,
                    image: achievement.image,
                    name: achievement.name,
                    type: "0",
                    isAchieved: false,
                    dateAchieved: undefined,
                    percentageAchieved: Number(percentage ?? 0)
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
                const achievement = achievementsToUpdate.find((a) => a.platformId === String(achievementUpdated.platformId));

                if (!achievement) {
                    continue;
                }

                let percentage = 0;
                if (Number(achievement.percentageAchieved)) {
                    percentage = achievement.percentageAchieved;
                } else if (Number(achievementUpdated.percentageAchieved)) {
                    percentage = achievementUpdated.percentageAchieved!;
                }

                const achievementToUpdate = <Achievement>{
                    id: achievement.id,
                    gameId: gameId,
                    isAchieved: true,
                    percentageAchieved: percentage,
                    dateAchieved: achievementUpdated.dateAchieved
                };

                achievementsList.push(achievementToUpdate);
            }

            return await this.achievementRepository.save(achievementsList);
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new Error(`Failed to edit game: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const achievement = await this.achievementRepository.findOneBy({ id });

            if (!achievement) {
                throw new NotFoundError("Achievement not found");
            }

            await this.achievementRepository.delete(id);
            return true;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new Error(`Failed to delete achievement: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    async editMultiple(achievements: Partial<Achievement>[]): Promise<Achievement[] | null> {
        try {
            const updatedAchievements = [];
            const dbAchievements = await this.achievementRepository.findBy({ gameId: achievements[0].gameId });

            for (const achievement of achievements) {
                const dbAchievement = dbAchievements.find((a) => a.id === achievement.id);

                if (!dbAchievement) {
                    throw new NotFoundError("Achievement not found");
                }

                Object.assign(dbAchievement, achievement);
                updatedAchievements.push(achievement);
            }

            return await this.achievementRepository.save(updatedAchievements);
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new Error(`Failed to edit achievement: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    async manualSave(achievement: Achievement, gameId: string) {
        try {
            const newAchievement = this.achievementRepository.create({
                gameId: gameId,
                platformId: "",
                description: achievement.description,
                image: achievement.image,
                name: achievement.name,
                type: "0",
                isAchieved: achievement.isAchieved,
                dateAchieved: achievement.dateAchieved,
                percentageAchieved: Number(achievement.percentageAchieved ?? 0)
            });

            return await this.achievementRepository.save(newAchievement);
        } catch (error) {
            if (error instanceof ValidationError) {
                throw error;
            }
            throw new Error(`Failed to save game: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
}
