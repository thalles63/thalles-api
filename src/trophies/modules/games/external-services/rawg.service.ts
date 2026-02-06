import { Injectable } from "@nestjs/common";
import axios from "axios";
import type { Game } from "../../../domain/entities/games.entity";
import { TrophiesConfig } from "../../../infrastructure/config/app.config";

@Injectable()
export class RawgService {
    async searchGameByName(gameName: string): Promise<Partial<Game[]> | null> {
        try {
            const gamesResponse = await axios.get(`https://api.rawg.io/api/games?key=${TrophiesConfig.rawg.apiKey}&search=${gameName}}&page_size=20`);

            return gamesResponse.data.results.map((game: any): Partial<Game> => {
                return {
                    id: game.id,
                    name: game.name,
                    image: game.background_image
                };
            });
        } catch (error) {
            console.error("Error searching game in RAWG:", error);
            throw new Error("Failed to search game in RAWG");
        }
    }
}
