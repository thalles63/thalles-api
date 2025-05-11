import { exchangeAccessCodeForAuthTokens, exchangeNpssoForAccessCode, getUserPlayedGames } from "psn-api";
import { playstationConfig } from "../config/playstation.config";
import { Game } from "../entities/games.entity";

export class PlayStationService {
    private psnAccessToken = "";

    async getUserGames(): Promise<Partial<Game>[]> {
        try {
            const userTitles = await this.fetchPaginatedData(getUserPlayedGames);

            return userTitles.map((game: any) => {
                return {
                    name: game.name,
                    externalGameId: game.concept.id.toString(),
                    platform: 2,
                    timePlayed: this.parsePlayDuration(game.playDuration)
                };
            });
        } catch (error) {
            console.error("Error fetching user games from PSN:", error);
            throw new Error("Failed to fetch games from PlayStation");
        }
    }

    // async getGameAchievements(accessToken: string, gameId: string): Promise<Partial<Achievements>[]> {
    //     try {
    //         const response = await getUserTrophiesEarnedForTitle({ accessToken }, "me", gameId, "all", { npServiceName: "trophy" });

    //         return response.trophies.map((trophy: UserThinTrophy) => ({
    //             name: trophy.trophyId.toString(),
    //             description: "",
    //             image: trophy.trophyRewardImageUrl || "",
    //             percentageAchieved: parseFloat(trophy.trophyEarnedRate || "0"),
    //             isAchieved: trophy.earned || false
    //         }));
    //     } catch (error) {
    //         console.error("Error fetching game achievements from PSN:", error);
    //         throw new Error("Failed to fetch achievements from PlayStation");
    //     }
    // }

    // async getUserProfile(accessToken: string, username: string): Promise<any> {
    //     try {
    //         return await getProfileFromUserName({ accessToken }, username);
    //     } catch (error) {
    //         console.error("Error fetching user profile from PSN:", error);
    //         throw new Error("Failed to fetch user profile from PlayStation");
    //     }
    // }

    private parsePlayDuration(duration: string): number {
        // Parse ISO 8601 duration format (e.g., "PT228H56M33S")
        const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (!match) return 0;

        const [, hours, minutes, seconds] = match;
        return parseInt(hours || "0") * 3600 + parseInt(minutes || "0") * 60 + parseInt(seconds || "0");
    }

    private async getPsnAccessToken() {
        if (this.psnAccessToken) {
            return this.psnAccessToken;
        }

        const myNpsso = playstationConfig.npssoToken;
        const accessCode = await exchangeNpssoForAccessCode(myNpsso!);
        const authorization = await exchangeAccessCodeForAuthTokens(accessCode);

        this.psnAccessToken = authorization.accessToken;
        return authorization.accessToken;
    }

    private async fetchPaginatedData(fetchFn: Function, limit = 200) {
        const accessToken = await this.getPsnAccessToken();

        const [firstPage, secondPage] = await Promise.all([
            fetchFn({ accessToken }, "me", { limit, offset: 0 }),
            fetchFn({ accessToken }, "me", { limit, offset: limit })
        ]);
        return [...firstPage.titles, ...secondPage.titles];
    }
}
