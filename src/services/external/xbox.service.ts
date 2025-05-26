import { authenticate } from "@xboxreplay/xboxlive-auth";
import axios from "axios";
import { config } from "../../config/app.config";
import { Game } from "../../entities/games.entity";
import { XboxAchievement } from "../../interfaces/xbox-achievement.interface";
import { XboxAchievementsResponse } from "../../interfaces/xbox-achievements-response.interface";
import { XboxTitle } from "../../interfaces/xbox-title.interface";
import { XboxTitlesResponse } from "../../interfaces/xbox-titles-response.interface";
import { PlatformEnum } from "../../utils/enums/platform.enum";

export class XboxService {
    private readonly token = {
        accessToken: "",
        expiresIn: "",
        xuid: "",
        userHash: ""
    };

    async getUserGames(): Promise<Partial<Game>[]> {
        try {
            const token = await this.getXboxAccessToken();
            let games = <XboxTitle[]>[];
            let continuationToken: string | null = "";

            while (true) {
                let url = `https://achievements.xboxlive.com/users/xuid(${token.xuid})/history/titles`;

                if (continuationToken) {
                    url += "?continuationToken=" + continuationToken;
                }

                const response = await axios.get<XboxTitlesResponse>(url, {
                    headers: {
                        Authorization: `XBL3.0 x=${token.userHash};${token.accessToken}`,
                        "x-xbl-contract-version": "2",
                        Accept: "application/json",
                        "Accept-Language": "en-US"
                    }
                });

                games = [...games, ...response.data.titles];
                continuationToken = response.data.pagingInfo.continuationToken;

                if (!continuationToken) {
                    break;
                }
            }

            return games.map((game) => {
                return {
                    name: game.name,
                    igdbId: "",
                    platformId: game.titleId.toString(),
                    platform: PlatformEnum.Xbox,
                    timePlayed: 0,
                    isPlatinumed: false,
                    isCampaignComplete: game.currentGamerscore >= 1000,
                    lastTimePlayed: game.currentGamerscore > 0 ? game.lastUnlock : undefined
                };
            });
        } catch (error) {
            console.error("Error fetching user games from Xbox:", error);
            if (error && typeof error === "object" && "response" in error) {
                console.error("Response data:", (error as any).response?.data);
            }
            throw new Error("Failed to fetch games from Xbox");
        }
    }

    async getListOfAchievements(game: Game): Promise<XboxAchievement[]> {
        try {
            const token = await this.getXboxAccessToken();
            let achievements = <XboxAchievement[]>[];
            let continuationToken: string | null = "";

            while (true) {
                let url = `https://achievements.xboxlive.com/users/xuid(${token.xuid})/achievements?titleId=${game.platformId}`;

                if (continuationToken) {
                    url += "&continuationToken=" + continuationToken;
                }

                const response = await axios.get<XboxAchievementsResponse>(url, {
                    params: {
                        titleId: game.platformId
                    },
                    headers: {
                        Authorization: `XBL3.0 x=${token.userHash};${token.accessToken}`,
                        "x-xbl-contract-version": "2",
                        Accept: "application/json",
                        "Accept-Language": "en-US"
                    }
                });

                achievements = [...achievements, ...response.data.achievements];
                continuationToken = response.data.pagingInfo.continuationToken;

                if (!continuationToken) {
                    break;
                }
            }

            return achievements;
        } catch (error) {
            console.error("Error fetching achievements from Xbox:", error);
            throw new Error("Failed to fetch achievements from Xbox");
        }
    }

    private async getXboxAccessToken() {
        if (this.token.xuid) {
            const isAccessTokenExpired = new Date(this.token.expiresIn).getTime() < new Date().getTime();

            if (!isAccessTokenExpired) {
                return this.token;
            }
        }

        try {
            const response: any = await authenticate(config.xbox.username!, config.xbox.password!);

            this.token.accessToken = response.xsts_token;
            this.token.expiresIn = response.expires_on;
            this.token.xuid = response.xuid;
            this.token.userHash = response.user_hash;

            return this.token;
        } catch (error) {
            console.error("Error getting Xbox Live token:", error);
            throw new Error("Failed to get Xbox Live token");
        }
    }
}
