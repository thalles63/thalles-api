import { AuthObject, buildAuthorization, getGameExtended, getGameInfoAndUserProgress, getUserCompletionProgress } from "@retroachievements/api";
import { config } from "../../config/app.config";
import { Achievement } from "../../entities/achievements.entity";
import { Game } from "../../entities/games.entity";
import { PlatformEnum } from "../../utils/enums/platform.enum";

export class RetroAchievementsService {
    async getUserGames(): Promise<any> {
        try {
            const game = await getUserCompletionProgress(this.getAuthorization(), { username: config.retroAchievements.username ?? "" });
            return game.results.map((game: any) => {
                return {
                    name: game.title,
                    igdbId: "",
                    platformId: game.gameId.toString(),
                    platform: PlatformEnum.RetroAchievements,
                    timePlayed: 0,
                    retroConsole: game.consoleId,
                    isPlatinumed: false,
                    isCampaignComplete: false,
                    lastTimePlayed: game.mostRecentAwardedDate
                };
            });
        } catch (error) {
            console.error("Error fetching user games from Retro Achievements:", error);
            throw new Error("Failed to fetch games from Retro Achievements");
        }
    }

    async getListOfAchievements(game: Game) {
        try {
            const gameExtended = await getGameExtended(this.getAuthorization(), { gameId: game.platformId });
            return gameExtended.achievements;
        } catch (error) {
            console.error("Error fetching achievements from Xbox:", error);
            throw new Error("Failed to fetch achievements from Xbox");
        }
    }

    async listAllEarnedByGame(game: Partial<Game>): Promise<Partial<Achievement>[]> {
        try {
            if (!game.platformId) {
                return [];
            }

            const userProgress = await getGameInfoAndUserProgress(this.getAuthorization(), {
                username: config.retroAchievements.username ?? "",
                gameId: game.platformId
            });

            return Object.values(userProgress.achievements).map((a: any) => {
                return <Partial<Achievement>>{
                    isAchieved: !!a.dateEarned,
                    dateAchieved: a.dateEarned,
                    percentageAchieved: 0,
                    platformId: a.id.toString(),
                    type: a.points.toString()
                };
            });
        } catch (error) {
            console.error("Error fetching user games from Retro Achievements:", error);
            throw new Error("Failed to fetch games from Retro Achievements");
        }
    }

    private getAuthorization(): AuthObject {
        const username = config.retroAchievements.username ?? "";
        const webApiKey = config.retroAchievements.apiKey ?? "";

        return buildAuthorization({ username, webApiKey });
    }
}
