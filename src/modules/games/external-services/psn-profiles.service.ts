import { Injectable } from "@nestjs/common";
import axios from "axios";
import * as cheerio from "cheerio";
import type { AchievementSaveRequest } from "../../../domain/dtos/achievement-save-request.dto";
import { GamePsnProfiles } from "../../../domain/interfaces/game-psn-profiles.interface";
import { config } from "../../../infrastructure/config/app.config";

@Injectable()
export class PsnProfilesService {
    public async getAchievementsFromPsn(url: string) {
        try {
            const htmlFromUrl: any = (await axios.get(`http://api.scraperapi.com?api_key=${config.scrapper.key}&url=${encodeURIComponent(url)}`)).data;

            const $ = cheerio.load(htmlFromUrl);

            let achievements: AchievementSaveRequest[] = [];
            let tableFound = false;

            $("table").each((tableIndex, tableElement) => {
                if (tableFound) return;

                const achievementLines: AchievementSaveRequest[] = [];
                $(tableElement)
                    .find("tr")
                    .each((rowIndex, rowElement) => {
                        const imgSrc = $(rowElement).find("td:first-child img").attr("src");
                        const linkText = $(rowElement).find("td:nth-child(2) a").text().trim();
                        const afterFirstBr = $(rowElement).find("td:nth-child(2)").html()?.split("<br>")[1]?.replace(/\s+/g, " ").trim();
                        const category = $(rowElement).find("td:nth-child(6) img").attr("title");
                        const dateText = $(rowElement).find("td:nth-child(3) .typo-top-date").text();
                        const timeText = $(rowElement).find("td:nth-child(3) .typo-bottom-date").text();
                        const typoTop = $(rowElement)
                            .find("td:nth-child(4) .typo-top nobr")
                            .contents()
                            .filter(function () {
                                return this.type === "text";
                            })
                            .text()
                            .trim();

                        if (!!imgSrc && !!linkText && !!afterFirstBr && !!typoTop) {
                            achievementLines.push(<AchievementSaveRequest>{
                                image: imgSrc || "",
                                name: linkText,
                                dateAchieved: dateText ? this.parseDateTime(dateText, timeText) : undefined,
                                description: afterFirstBr,
                                isAchieved: !!dateText,
                                percentageAchieved: Number(typoTop.slice(0, -1)) || 0,
                                type: category?.toLowerCase()
                            });
                        }
                    });

                if (achievementLines.length > 0) {
                    achievements = achievementLines;
                    tableFound = true;
                }
            });

            return achievements;
        } catch (error) {
            console.log(error);
        }
    }

    public async searchGame(gameName: string) {
        try {
            const url = "https://psnprofiles.com/search/games?q=" + gameName;
            const htmlFromUrl: any = (await axios.get(`http://api.scraperapi.com?api_key=${config.scrapper.key}&url=${encodeURIComponent(url)}`)).data;

            const $ = cheerio.load(htmlFromUrl);

            const results: GamePsnProfiles[] = [];

            $("table.box.zebra tr").each((_, tr) => {
                const row = $(tr);
                const tdImage = row.find("td:first-child");
                const tdInfo = row.find("td").eq(1);

                const image = tdImage.find("img.game").attr("src") ?? "";

                const titleLink = tdInfo.find("a.title");
                const name = titleLink.text().trim();
                const url = "https://psnprofiles.com" + titleLink.attr("href");

                const platforms = tdInfo
                    .find(".platforms .tag.platform")
                    .map((_, el) => $(el).text().trim())
                    .get();

                const clone = tdInfo.clone();
                clone.find("a.title, .platforms, br, bullet").remove();
                const regionRaw = clone.text().replace(/\s+/g, " ").trim();

                let region: string | null = null;

                if (regionRaw) {
                    const cleaned = regionRaw.replace(/•/g, "").trim();
                    const m = cleaned.match(/([A-Za-z]{2,})$/);
                    if (m) region = m[1];
                    else if (cleaned.length) region = cleaned;
                }

                if (!region) {
                    const platformTitle = tdInfo.find(".platforms .tag.platform").attr("title");
                    if (platformTitle) {
                        region = platformTitle.trim();
                    }
                }

                if (name) {
                    results.push({
                        name,
                        image,
                        platforms,
                        region,
                        url
                    });
                }
            });

            return results;
        } catch (error) {
            console.log(error);
        }
    }
    private parseDateTime(data: string, hora: string) {
        const cleanDateText = data.replace(/(\d+)(st|nd|rd|th)/, "$1");
        const fullDateTime = `${cleanDateText} ${hora}`;
        const dateInGmtPlus1 = new Date(`${fullDateTime} GMT+0000`);
        const dateInGmtMinus3 = new Date(dateInGmtPlus1.getTime() - 0 * 60 * 60 * 1000);

        return new Date(dateInGmtMinus3);
    }
}
