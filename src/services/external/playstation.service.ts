import axios from "axios";
import {
    exchangeAccessCodeForAuthTokens,
    exchangeNpssoForAccessCode,
    exchangeRefreshTokenForAuthTokens,
    getTitleTrophies,
    getUserPlayedGames,
    getUserTrophiesEarnedForTitle
} from "psn-api";
import { config } from "../../config/app.config";
import { Achievement } from "../../entities/achievements.entity";
import { Game } from "../../entities/games.entity";
import { PlatformEnum } from "../../utils/enums/platform.enum";

export class PlayStationService {
    private readonly token = {
        accessToken: "",
        refreshToken: "",
        expiresIn: ""
    };

    async getUserGames(): Promise<Partial<Game>[]> {
        try {
            const userTitles = await this.fetchPaginatedData(getUserPlayedGames);

            return userTitles.map((game: any) => {
                return {
                    name: game.name,
                    igdbId: game.concept.id.toString(),
                    platformId: game.titleId,
                    platform: game.category === "ps5_native_game" ? PlatformEnum.Playstation5 : PlatformEnum.Playstation4,
                    timePlayed: this.parsePlayDuration(game.playDuration)
                };
            });
        } catch (error) {
            console.error("Error fetching user games from PSN:", error);
            throw new Error("Failed to fetch games from PlayStation");
        }
    }

    async getListOfTrophies(game: Game) {
        try {
            const accessToken = await this.getPsnAccessToken();
            const { trophies } = await getTitleTrophies({ accessToken }, game.platformId, "default", {
                npServiceName: game.platform !== PlatformEnum.Playstation5 ? "trophy" : undefined
            });

            return trophies;
        } catch (error) {
            console.error("Error fetching user games from PSN:", error);
            throw new Error("Failed to fetch games from PlayStation");
        }
    }

    async getNpCommunicationId(game: Game): Promise<any> {
        try {
            const accessToken = await this.getPsnAccessToken();
            const accountId = config.psn.accountId;
            const titleId = game.platformId;

            const response = await axios.get(`https://m.np.playstation.com/api/trophy/v1/users/${accountId}/titles/trophyTitles`, {
                params: {
                    npTitleIds: titleId
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: "application/json"
                }
            });

            return response.data;
        } catch (error) {
            console.error("Error fetching achievements from PSN:", error);
            throw new Error("Failed to fetch achievements from PlayStation");
        }
    }

    async listAllEarnedByGame(game: Partial<Game>): Promise<Partial<Achievement>[]> {
        try {
            const accessToken = await this.getPsnAccessToken();
            const { trophies } = await getUserTrophiesEarnedForTitle({ accessToken }, config.psn.accountId!, game.platformId!, "default", {
                npServiceName: game.platform !== PlatformEnum.Playstation5 ? "trophy" : undefined
            });

            return trophies
                .filter((a) => a.earned)
                .map((a) => {
                    return <Partial<Achievement>>{
                        isAchieved: true,
                        dateAchieved: a.earnedDateTime,
                        percentageAchieved: a.trophyEarnedRate,
                        platformId: a.trophyId.toString(),
                        type: a.trophyType
                    };
                });
        } catch (error) {
            console.error("Error fetching user games from PSN:", error);
            throw new Error("Failed to fetch games from PlayStation");
        }
    }

    private parsePlayDuration(duration: string): number {
        const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (!match) return 0;

        const [, hours, minutes, seconds] = match;
        return parseInt(hours || "0") * 3600 + parseInt(minutes || "0") * 60 + parseInt(seconds || "0");
    }

    private async getPsnAccessToken() {
        if (this.token.accessToken) {
            const isAccessTokenExpired = new Date(this.token.expiresIn).getTime() < new Date().getTime();

            if (isAccessTokenExpired) {
                const updatedAuthorization = await exchangeRefreshTokenForAuthTokens(this.token.refreshToken);

                this.token.accessToken = updatedAuthorization.accessToken;
                this.token.expiresIn = new Date(new Date().getTime() + updatedAuthorization.expiresIn * 1000).toISOString();
            }

            return this.token.accessToken;
        }

        const myNpsso = config.psn.npssoToken!;
        const accessCode = await exchangeNpssoForAccessCode(myNpsso);
        const authorization = await exchangeAccessCodeForAuthTokens(accessCode);

        this.token.accessToken = authorization.accessToken;
        this.token.refreshToken = authorization.refreshToken;
        this.token.expiresIn = new Date(new Date().getTime() + authorization.expiresIn * 1000).toISOString();

        return authorization.accessToken;
    }

    private async fetchPaginatedData(fetchFn: Function, limit = 200) {
        const accessToken = await this.getPsnAccessToken();

        const [firstPage, secondPage] = await Promise.all([
            fetchFn({ accessToken }, config.psn.accountId, { limit, offset: 0 }),
            fetchFn({ accessToken }, config.psn.accountId, { limit, offset: limit })
        ]);
        return [...firstPage.titles, ...secondPage.titles];
    }
}
