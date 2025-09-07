import * as msal from "@azure/msal-node";
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
        msalExpiresIn: new Date(),
        userHash: ""
    };

    async getUserGames(ws: any): Promise<Partial<Game>[]> {
        try {
            const token = await this.getXboxAccessToken(ws);
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

    async getListOfAchievements(game: Game, ws: any): Promise<XboxAchievement[]> {
        try {
            const token = await this.getXboxAccessToken(ws);
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

    private async getMicrosoftToken(ws: any) {
        try {
            const pca = new msal.PublicClientApplication({
                auth: { clientId: config.xbox.clientId!, authority: "https://login.microsoftonline.com/consumers" }
            });

            const result = await pca.acquireTokenByDeviceCode({
                scopes: ["XboxLive.signin", "XboxLive.offline_access"],
                deviceCodeCallback: (info) => {
                    console.log(info.message);
                    ws.send(
                        JSON.stringify({
                            type: "code",
                            userCode: info.userCode,
                            verificationUri: info.verificationUri,
                            message: info.message
                        })
                    );
                }
            });

            return result;
        } catch (error) {
            console.error("Error getting Msal token:", error);
            throw new Error("Error getting Msal token");
        }
    }

    private async getXboxAccessToken(ws: any) {
        // if (this.token.xuid) {
        //     const isAccessTokenExpired = new Date(this.token.expiresIn).getTime() < new Date().getTime();
        //     const isMsalTokenExpired = this.token.msalExpiresIn.getTime() < new Date().getTime();

        //     if (!isAccessTokenExpired && !isMsalTokenExpired) {
        //         return this.token;
        //     }
        // }

        const msToken = await this.getMicrosoftToken(ws);
        this.token.msalExpiresIn = msToken?.expiresOn!;

        try {
            const userRes: any = await fetch("https://user.auth.xboxlive.com/user/authenticate", {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({
                    Properties: {
                        AuthMethod: "RPS",
                        SiteName: "user.auth.xboxlive.com",
                        RpsTicket: `d=${msToken?.accessToken}`
                    },
                    RelyingParty: "http://auth.xboxlive.com",
                    TokenType: "JWT"
                })
            });

            if (!userRes.ok) throw new Error(`user.auth failed: ${userRes.status}`);
            const userJson = await userRes.json();

            const xstsResponse: any = await fetch("https://xsts.auth.xboxlive.com/xsts/authorize", {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({
                    Properties: {
                        SandboxId: "RETAIL",
                        UserTokens: [userJson.Token]
                    },
                    RelyingParty: "http://xboxlive.com",
                    TokenType: "JWT"
                })
            }).then((r) => r.json());

            this.token.accessToken = xstsResponse.Token;
            this.token.expiresIn = xstsResponse.NotAfter;
            this.token.xuid = xstsResponse.DisplayClaims.xui[0].xid;
            this.token.userHash = xstsResponse.DisplayClaims.xui[0].uhs;

            return this.token;
        } catch (error) {
            console.error("Error getting Xbox Live token:", error);
            throw new Error("Failed to get Xbox Live token");
        }
    }
}
