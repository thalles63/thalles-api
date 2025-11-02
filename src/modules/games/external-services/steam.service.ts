import { Injectable } from "@nestjs/common";
import axios from "axios";
import { AchievementSaveRequest } from "../../../domain/dtos/achievement-save-request.dto";
import type { Game } from "../../../domain/entities/games.entity";
import { config } from "../../../infrastructure/config/app.config";

@Injectable()
export class SteamService {
    private readonly apiKey = config.steam.apiKey!;

    public async searchGameByName(gameName: string): Promise<Partial<Game[]> | null> {
        const gamesResponse: any = await axios.get(`https://store.steampowered.com/api/storesearch/?term=${gameName}&cc=br`);

        return gamesResponse.data.items.map((game: any) => {
            return {
                platformId: game.id,
                name: game.name,
                image: game.tiny_image
            };
        });
    }

    async getListOfAchievements(steamId: string): Promise<AchievementSaveRequest[]> {
        try {
            const gameAchievements: any = await axios.get(
                `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${this.apiKey}&appid=${steamId}`
            );

            if (!gameAchievements.data.game?.availableGameStats?.achievements) {
                return [];
            }

            return gameAchievements.data.game.availableGameStats.achievements.map((achievement: any) => {
                return <AchievementSaveRequest>{
                    platformId: achievement.name,
                    name: achievement.displayName,
                    description: achievement.description,
                    type: "0",
                    image: achievement.icon,
                    isAchieved: false,
                    percentageAchieved: 0,
                    dateAchieved: undefined
                };
            });
        } catch (error) {
            console.error("Error fetching achievements from Steam:", error);
            throw new Error("Failed to fetch achievements from Steam");
        }
    }

    async getAchievementPercentages(gameId: string): Promise<{ name: string; percent: string }[]> {
        try {
            const gameAchievements: any = await axios.get(
                `https://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v2/?gameid=${gameId}`
            );

            if (!gameAchievements?.data?.achievementpercentages?.achievements) {
                return [];
            }

            return gameAchievements.data.achievementpercentages.achievements;
        } catch (error: any) {
            if (error.message === "Request failed with status code 400") {
                return [];
            }

            if (error.status === 403) {
                return [];
            }

            console.error("Error fetching achievements from Steam:", error);
            throw new Error("Failed to fetch achievements from Steam");
        }
    }
}
