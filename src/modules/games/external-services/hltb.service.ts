import { Injectable } from "@nestjs/common";
import axios from "axios";
import * as cheerio from "cheerio";
import UserAgent from "user-agents";
import { HowLongToBeatQueryData } from "../../../domain/data/how-long-to-beat-query.data";
import { config } from "../../../infrastructure/config/app.config";

@Injectable()
export class HltbService {
    private readonly BASE_URL = "https://howlongtobeat.com/";
    private readonly DETAIL_URL = `${this.BASE_URL}game?id=`;
    private readonly SEARCH_URL = `${this.BASE_URL}api/locate/`;
    private readonly SEARCH_KEY_PATTERN = /"\/api\/locate\/".concat\("([a-zA-Z0-9]+)"\).concat\("([a-zA-Z0-9]+)"\)/g;
    private searchKey = "";

    public async searchByName(query: Array<string>, signal?: AbortSignal): Promise<any> {
        let search = { ...HowLongToBeatQueryData };
        search.searchTerms = query;
        try {
            if (!this.searchKey) {
                this.searchKey = await this.getSearchKey();
            }

            const searchUrlWithKey = this.SEARCH_URL + this.searchKey;

            let result = await axios.post(searchUrlWithKey, search, {
                headers: {
                    "User-Agent": new UserAgent().toString(),
                    Accept: "*/*",
                    "Content-Type": "application/json",
                    Origin: "https://howlongtobeat.com",
                    Referer: `https://howlongtobeat.com/`
                },
                timeout: 20000,
                signal
            });

            return result.data;
        } catch (error: any) {
            if (error) {
                throw new Error(error);
            } else if (error.response.status !== 200) {
                throw new Error(`Got non-200 status code from howlongtobeat.com [${error.response.status}]
              ${JSON.stringify(error.response)}
            `);
            }
        }
    }

    private async getSearchKey(): Promise<string> {
        const res = await axios.get(this.BASE_URL, {
            headers: {
                "User-Agent": new UserAgent().toString(),
                origin: "https://howlongtobeat.com",
                referer: "https://howlongtobeat.com"
            }
        });
        const html = res.data;
        const $ = cheerio.load(html);

        const scripts = $("script[src]");

        for (const el of scripts) {
            const src = $(el).attr("src") as string;

            if (!src.includes("_app-")) {
                continue;
            }

            const scriptUrl = this.BASE_URL + src;

            try {
                const res = await axios.get(scriptUrl, {
                    headers: {
                        "User-Agent": new UserAgent().toString(),
                        origin: "https://howlongtobeat.com",
                        referer: "https://howlongtobeat.com"
                    }
                });

                const scriptText = res.data;
                const matches = [...scriptText.matchAll(this.SEARCH_KEY_PATTERN)];
                const firstKey: string = matches[0][1];
                const secondKey: string = matches[0][2];
                return firstKey.concat(secondKey);
            } catch (error) {
                continue;
            }
        }

        throw new Error("Could not find search key");
    }

    public async getInfoFromHltb(gameId: string) {
        try {
            const url = `${this.DETAIL_URL}${gameId}`;
            const htmlFromUrl: any = (await axios.get(`http://api.scraperapi.com?api_key=${config.scrapper.key}&url=${encodeURIComponent(url)}`)).data;

            const $ = cheerio.load(htmlFromUrl);
            const times: any = {};

            const timeBox = $('div[class*="GameStats_game_times__"]');

            timeBox.find("li").each((_, el) => {
                const label = $(el).find("h4").text().trim();
                const value = $(el).find("h5").text().trim();
                const minutes = this.parseHLTBTimeToMinutes(value);

                if (label === "Main Story") times.mainStoryTime = minutes;
                if (label.startsWith("Main +")) times.mainExtrasTime = minutes;
                if (label === "Completionist") times.completionistTime = minutes;
            });

            return times;
        } catch (error) {
            console.log(error);
        }
    }

    private parseHLTBTimeToMinutes(value: string): number | null {
        if (!value) return null;
        value = value.trim();

        if (value === "--") return null;

        value = value.replace("½", ".5");

        if (value.includes("Hour")) {
            const num = parseFloat(value.replace(/[^\d.]/g, ""));
            return isNaN(num) ? null : Math.round(num * 60);
        }

        if (value.includes("Min")) {
            const mins = parseFloat(value.replace(/[^\d.]/g, ""));
            return isNaN(mins) ? null : Math.round(mins);
        }

        return null;
    }
}
