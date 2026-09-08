import { Injectable } from "@nestjs/common";
import axios from "axios";
import * as cheerio from "cheerio";
import type { AchievementSaveRequestDto } from "../../../domain/dtos/achievement-save-request.dto";
import { GameExophase } from "../../../domain/interfaces/game-exophase.interface";
import { TrophiesConfig } from "../../../infrastructure/config/app.config";

@Injectable()
export class ExophaseService {
    public async searchGame(gameName: string): Promise<GameExophase[]> {
        try {
            const url = `https://api.exophase.com/public/archive/games?q=${encodeURIComponent(gameName)}&sort=updated&userId=0`;
            const { data } = await axios.get(`http://api.scraperapi.com?api_key=${TrophiesConfig.scrapper.key}&url=${encodeURIComponent(url)}`);

            const games: any[] = data?.games?.list ?? [];

            return games.map(
                (game): GameExophase => ({
                    name: game.title,
                    image: game.images?.l ?? game.images?.m ?? "",
                    platforms: (game.platforms ?? []).map((platform: any) => platform.name),
                    url: game.endpoint_awards
                })
            );
        } catch (error) {
            console.error("Error searching games on Exophase:", error);
            throw new Error("Failed to search games on Exophase");
        }
    }

    public async getAchievementsFromExophase(url: string): Promise<AchievementSaveRequestDto[]> {
        try {
            const htmlFromUrl: any = (await axios.get(`http://api.scraperapi.com?api_key=${TrophiesConfig.scrapper.key}&url=${encodeURIComponent(url)}`)).data;

            const $ = cheerio.load(htmlFromUrl);

            return $("ul.list-unordered-base li.award")
                .map((_, element) => {
                    const li = $(element);

                    const name = li.find(".award-title a").text().trim();
                    const description = li.find(".award-description").text().trim();
                    const image = li.find("img.award-image").attr("src") ?? "";
                    const rarityLabel = li.find(".award-average .tippy").attr("data-tippy-content")?.split(" (")[0];

                    return <AchievementSaveRequestDto>{
                        name,
                        description,
                        image,
                        type: rarityLabel?.toLowerCase(),
                        percentageAchieved: Number(li.attr("data-average")) || 0,
                        isAchieved: li.attr("data-earned") === "1",
                        dateAchieved: undefined
                    };
                })
                .get()
                .filter((achievement) => !!achievement.name);
        } catch (error) {
            console.error("Error fetching achievements from Exophase:", error);
            throw new Error("Failed to fetch achievements from Exophase");
        }
    }
}
