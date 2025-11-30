import { InjectRepository } from "@nestjs/typeorm";
import { AuthObject, buildAuthorization, getGameExtended } from "@retroachievements/api";
import { Repository } from "typeorm";
import { AchievementSaveRequestDto } from "../../../domain/dtos/achievement-save-request.dto";
import { RetroAchievementsGames } from "../../../domain/entities/retroAchievementsGames.entity";
import { config } from "../../../infrastructure/config/app.config";

export class RetroAchievementsService {
    constructor(@InjectRepository(RetroAchievementsGames) private readonly retroAchievementsGamesRepository: Repository<RetroAchievementsGames>) {}

    async searchGameByName(gameName: string, platform: number) {
        const games = await this.retroAchievementsGamesRepository.findOneBy({ platform: platform });

        return games?.games
            .filter((game: any) => game.Title.toString().toLowerCase().includes(gameName.toLowerCase()))
            .map((game: any) => ({
                platformId: game.ID,
                name: game.Title,
                image: game.ImageIcon
            }));
    }

    async getAchievements(retroAchievementsId: number) {
        try {
            const gameExtended = await getGameExtended(this.getAuthorization(), { gameId: retroAchievementsId });

            return Object.values(gameExtended.achievements).map((achievement) => {
                return <AchievementSaveRequestDto>{
                    image: "https://media.retroachievements.org/Badge/" + achievement.badgeName + ".png",
                    name: achievement.title,
                    dateAchieved: undefined,
                    description: achievement.description,
                    isAchieved: false,
                    percentageAchieved: 0,
                    type: achievement.points.toString()
                };
            });
        } catch (error) {
            console.error("Error fetching achievements from Xbox:", error);
            throw new Error("Failed to fetch achievements from Xbox");
        }
    }

    private getAuthorization(): AuthObject {
        const username = config.retroAchievements.username ?? "";
        const webApiKey = config.retroAchievements.apiKey ?? "";

        return buildAuthorization({ username, webApiKey });
    }
}
