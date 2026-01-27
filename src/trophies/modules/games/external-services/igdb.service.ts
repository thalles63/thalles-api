import { Injectable } from "@nestjs/common";
import axios from "axios";
import type { Game } from "../../../domain/entities/games.entity";
import { TrophiesConfig } from "../../../infrastructure/config/app.config";

@Injectable()
export class IgdbService {
    private accessToken: string | null = null;
    private tokenExpiration: number = 0;

    private async getAccessToken(): Promise<string> {
        if (this.accessToken && Date.now() < this.tokenExpiration) {
            return this.accessToken;
        }

        try {
            const response: any = await axios.post(
                `https://id.twitch.tv/oauth2/token?client_id=${TrophiesConfig.igdb.clientId}&client_secret=${TrophiesConfig.igdb.clientSecret}&grant_type=client_credentials`
            );

            this.accessToken = response.data.access_token;
            this.tokenExpiration = Date.now() + response.data.expires_in * 1000;

            return this.accessToken ?? "";
        } catch (error) {
            console.error("Error getting IGDB access token:", error);
            throw new Error("Failed to get IGDB access token");
        }
    }

    async searchGameByName(gameName: string): Promise<Partial<Game[]> | null> {
        try {
            const token = await this.getAccessToken();

            const gamesResponse: any = await axios.post(
                "https://api.igdb.com/v4/games",
                `search "${gameName}";
                where game_type = (0, 3, 4, 8, 9, 10, 11, 13);
                fields name,cover.url,screenshots.url, summary, first_release_date, franchise.slug, franchise.name, genres.name, genres.slug, themes.name, themes.slug, involved_companies.developer, involved_companies.company.name, involved_companies.publisher, checksum;
                limit 20;`,
                {
                    headers: {
                        "Client-ID": TrophiesConfig.igdb.clientId,
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "text/plain"
                    }
                }
            );

            return gamesResponse.data.map((game: any): Partial<Game> => {
                return {
                    name: game.name,
                    releaseDate: game.first_release_date ? new Date(new Date(game.first_release_date * 1000).toISOString().split("T")[0]) : undefined,
                    genres: game.genres?.map((genre: any) => genre.slug),
                    themes: game.themes?.map((theme: any) => theme.slug),
                    developer: game.involved_companies?.find((company: any) => company.developer)?.company.name,
                    publisher: game.involved_companies?.find((company: any) => company.publisher)?.company.name,
                    image: game.cover?.url ? `https:${game.cover.url.replace("t_thumb", "t_cover_big_2x")}` : "",
                    screenshots: game.screenshots?.length ? game.screenshots.map((s: any) => "https:" + s.url.replace("t_thumb", "t_1080p_2x")) : "",
                    banner: game.screenshots?.length ? `https:${game.screenshots[0].url.replace("t_thumb", "t_1080p_2x")}` : "",
                    description: game.summary,
                    id: game.checksum
                };
            });
        } catch (error) {
            console.error("Error searching game in IGDB:", error);
            throw new Error("Failed to search game in IGDB");
        }
    }
}
