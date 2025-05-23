import axios from "axios";
import { config } from "../../config/app.config";
import { Achievement } from "../../entities/achievements.entity";
import { Game } from "../../entities/games.entity";
import { PlatformEnum } from "../../utils/enums/platform.enum";

export interface SteamAchievement {
    name: string;
    description: string;
    icon: string;
    achieved: boolean;
    unlocktime: number;
}

export interface SteamGame {
    appid: number;
    name: string;
    playtime_forever: number;
    achievements?: {
        total: number;
        achieved: number;
    };
}

export class SteamService {
    private readonly apiKey: string;
    private readonly steamId: string;

    constructor() {
        this.apiKey = config.steam.apiKey!;
        this.steamId = config.steam.steamId!;
    }

    async getUserGames(): Promise<Partial<Game>[]> {
        try {
            const response: any = await axios.get(
                `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${this.apiKey}&steamid=${this.steamId}&include_appinfo=true&include_played_free_games=true`
            );

            const games = response.data.response.games as SteamGame[];

            return games.map((game) => {
                return {
                    name: game.name,
                    igdbId: game.appid.toString(),
                    platformId: game.appid.toString(),
                    platform: PlatformEnum.Steam,
                    timePlayed: game.playtime_forever * 60
                };
            });
        } catch (error) {
            console.error("Error fetching user games from Steam:", error);
            throw new Error("Failed to fetch games from Steam");
        }
    }

    async getListOfAchievements(game: Game): Promise<Achievement[]> {
        try {
            const gameAchievements: any = await axios.get(
                `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${this.apiKey}&appid=${game.platformId}`
            );

            if (!gameAchievements.data.game?.availableGameStats?.achievements) {
                return [];
            }

            return gameAchievements.data.game.availableGameStats.achievements.map((achievement: any) => {
                return {
                    platformId: achievement.name,
                    name: achievement.displayName,
                    description: achievement.description,
                    type: 0,
                    image: achievement.icon,
                    isAchieved: false,
                    percentageAchieved: 0
                };
            });
        } catch (error) {
            console.error("Error fetching achievements from Steam:", error);
            throw new Error("Failed to fetch achievements from Steam");
        }
    }

    async getListOfAchievementsEarnedByGame(game: Game): Promise<Achievement[]> {
        try {
            const gameAchievements: any = await axios.get(
                `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/?key=${this.apiKey}&steamid=${this.steamId}&appid=${game.platformId}`
            );

            if (!gameAchievements.data.playerstats.achievements) {
                return [];
            }

            return gameAchievements.data.playerstats.achievements.map((achievement: any) => {
                return {
                    platformId: achievement.apiname,
                    isAchieved: achievement.achieved === 1,
                    dateAchieved: achievement.unlocktime
                };
            });
        } catch (error: any) {
            if (error.message === "Request failed with status code 400") {
                return [];
            }

            console.error("Error fetching achievements from Steam:", error);
            throw new Error("Failed to fetch achievements from Steam");
        }
    }

    async getAchievementPercentages(gameId: string): Promise<{ name: string; percent: string }[]> {
        try {
            const gameAchievements: any = await axios.get(
                `https://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v2/?gameid=${gameId}`
            );

            if (!gameAchievements.data.achievementpercentages.achievements) {
                return [];
            }

            return gameAchievements.data.achievementpercentages.achievements;
        } catch (error: any) {
            if (error.message === "Request failed with status code 400") {
                return [];
            }

            console.error("Error fetching achievements from Steam:", error);
            throw new Error("Failed to fetch achievements from Steam");
        }
    }
}
