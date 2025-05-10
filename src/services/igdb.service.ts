import axios from "axios";
import { igdbConfig } from "../config/igdb.config";
import { Game } from "../entities/games.entity";

export class IgdbService {
    private accessToken: string | null = null;
    private tokenExpiration: number = 0;

    private async getAccessToken(): Promise<string> {
        if (this.accessToken && Date.now() < this.tokenExpiration) {
            return this.accessToken;
        }

        try {
            const response: any = await axios.post(
                `https://id.twitch.tv/oauth2/token?client_id=${igdbConfig.clientId}&client_secret=${igdbConfig.clientSecret}&grant_type=client_credentials`
            );

            this.accessToken = response.data.access_token;
            this.tokenExpiration = Date.now() + response.data.expires_in * 1000;
            return this.accessToken || "";
        } catch (error) {
            console.error("Error getting IGDB access token:", error);
            throw new Error("Failed to get IGDB access token");
        }
    }

    async searchGameByName(gameName: string): Promise<Partial<Game> | null> {
        try {
            const token = await this.getAccessToken();

            const responseSearchByName: any = await axios.post(
                "https://api.igdb.com/v4/games",
                `where name ~ *"${gameName}"* & version_parent = null; 
                fields id,name;
                limit 10;`,
                {
                    headers: {
                        "Client-ID": igdbConfig.clientId,
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "text/plain"
                    }
                }
            );

            const gameId = this.getCorrectGameIdByName(responseSearchByName.data, this.normalize(gameName));

            const response: any = await axios.post(
                "https://api.igdb.com/v4/games",
                `where id = ${gameId}; 
                fields name,cover.url,screenshots.url;
                limit 1;`,
                {
                    headers: {
                        "Client-ID": igdbConfig.clientId,
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "text/plain"
                    }
                }
            );

            const game = response.data[0];

            return {
                name: game.name,
                image: game.cover?.url ? `https:${game.cover.url.replace("t_thumb", "t_cover_big_2x")}` : "",
                screenshot: game.screenshots[0].url.replace("t_thumb", "t_1080p_2x"),
                id: game.id
            };
        } catch (error) {
            console.error("Error searching game in IGDB:", error);
            throw new Error("Failed to search game in IGDB");
        }
    }

    private getCorrectGameIdByName(gamesList: any, gameNameNormalized: string): any {
        for (let game of gamesList) {
            if (this.normalize(game.name) === gameNameNormalized) {
                return game.id;
            }
        }

        return undefined;
    }

    private normalize(str: string) {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    }
}
