import { AuthObject, buildAuthorization, getGameExtended } from "@retroachievements/api";
import { AchievementSaveRequestDto } from "../../../domain/dtos/achievement-save-request.dto";
import { PlatformEnum } from "../../../domain/enums/platform.enum";
import { TrophiesConfig } from "../../../infrastructure/config/app.config";
import { PlaystationGames } from "../../../infrastructure/retro-games-data/playstation";
import { Playstation2Games } from "../../../infrastructure/retro-games-data/playstation2";
import { SnesGames } from "../../../infrastructure/retro-games-data/snes";

export class RetroAchievementsService {
    async searchGameByName(gameName: string, platform: number) {
        const games = this.getGamesFromPlatform(platform);

        return games
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
        const username = TrophiesConfig.retroAchievements.username ?? "";
        const webApiKey = TrophiesConfig.retroAchievements.apiKey ?? "";

        return buildAuthorization({ username, webApiKey });
    }

    private getGamesFromPlatform(platform: number) {
        switch (platform) {
            case PlatformEnum.Snes:
                return SnesGames;
            case PlatformEnum.Playstation2:
                return Playstation2Games;
            case PlatformEnum.Playstation1:
                return PlaystationGames;
            default:
                return [];
        }
    }
}
