import axios from "axios";
import { config } from "../../config/app.config";
import { Game } from "../../entities/games.entity";

export class IgdbService {
    private accessToken: string | null = null;
    private tokenExpiration: number = 0;

    private async getAccessToken(): Promise<string> {
        if (this.accessToken && Date.now() < this.tokenExpiration) {
            return this.accessToken;
        }

        try {
            const response: any = await axios.post(
                `https://id.twitch.tv/oauth2/token?client_id=${config.igdb.clientId}&client_secret=${config.igdb.clientSecret}&grant_type=client_credentials`
            );

            this.accessToken = response.data.access_token;
            this.tokenExpiration = Date.now() + response.data.expires_in * 1000;

            return this.accessToken ?? "";
        } catch (error) {
            console.error("Error getting IGDB access token:", error);
            throw new Error("Failed to get IGDB access token");
        }
    }

    async searchGameByExternalId(gameId: string): Promise<Partial<Game> | null> {
        try {
            const token = await this.getAccessToken();

            const externalGameResponse: any = await axios.post(
                "https://api.igdb.com/v4/external_games",
                `where uid = "${gameId}"; 
                fields *;
                limit 1;`,
                {
                    headers: {
                        "Client-ID": config.igdb.clientId,
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "text/plain"
                    }
                }
            );

            if (!externalGameResponse.data.length) {
                console.log("Skipped: " + gameId);
                return null;
            }

            const response: any = await axios.post(
                "https://api.igdb.com/v4/games",
                `where id = ${externalGameResponse.data[0].game}; 
                fields name,cover.url,screenshots.url, summary;
                limit 1;`,
                {
                    headers: {
                        "Client-ID": config.igdb.clientId,
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "text/plain"
                    }
                }
            );

            const game = response.data[0];

            return {
                name: game.name,
                image: game.cover?.url ? `https:${game.cover.url.replace("t_thumb", "t_cover_big_2x")}` : "",
                screenshot: `https:${game.screenshots[0].url.replace("t_thumb", "t_1080p_2x")}`,
                description: game.summary
            };
        } catch (error) {
            console.error("Error searching game in IGDB:", error);
            throw new Error("Failed to search game in IGDB");
        }
    }

    async searchGameByName(gameName: string): Promise<Partial<Game[]> | null> {
        try {
            const token = await this.getAccessToken();

            const gamesResponse: any = await axios.post(
                "https://api.igdb.com/v4/games",
                `search "${gameName}"; 
                fields name,cover.url,screenshots.url, summary;
                limit 20;`,
                {
                    headers: {
                        "Client-ID": config.igdb.clientId,
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "text/plain"
                    }
                }
            );

            return gamesResponse.data.map((game: any) => {
                return {
                    igdbId: game.id,
                    name: game.name,
                    image: game.cover?.url ? `https:${game.cover.url.replace("t_thumb", "t_cover_big_2x")}` : "",
                    screenshot: game.screenshots?.length ? `https:${game.screenshots[0].url.replace("t_thumb", "t_1080p_2x")}` : undefined,
                    description: game.summary
                };
            });
        } catch (error) {
            console.error("Error searching game in IGDB:", error);
            throw new Error("Failed to search game in IGDB");
        }
    }
}
