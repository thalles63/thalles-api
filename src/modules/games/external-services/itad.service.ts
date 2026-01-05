import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import axios from "axios";
import { firstValueFrom } from "rxjs";
import { Repository } from "typeorm";
import { Game } from "../../../domain/entities/games.entity";
import { StatusEnum } from "../../../domain/enums/status.enum";
import { config } from "../../../infrastructure/config/app.config";

@Injectable()
export class ItadService {
    constructor(
        @InjectRepository(Game) private gameRepository: Repository<Game>,
        private readonly httpService: HttpService
    ) {}

    @Cron(CronExpression.EVERY_DAY_AT_7AM)
    async handleGamesSync() {
        try {
            const gamesArray = (await this.gameRepository.findBy({ status: StatusEnum.Wishlist })).filter((game) => !!game.itadId).map((game) => game.itadId);
            const apiKey = config.itad.apiKey;
            const { data } = await firstValueFrom(this.httpService.post(`https://api.isthereanydeal.com/games/prices/v3?key=${apiKey}&country=BR`, gamesArray));

            for (const item of data) {
                let game = await this.gameRepository.findOne({ where: { itadId: item.id } });

                if (!game) {
                    continue;
                }

                if (item.deals[0].price.amount <= item.historyLow.all.amount) {
                    game.isPriceAllTimeLow = true;
                    game.isPriceOneYearTimeLow = true;
                } else if (item.deals[0].price.amount <= item.historyLow.y1.amount) {
                    game.isPriceAllTimeLow = false;
                    game.isPriceOneYearTimeLow = true;
                } else {
                    game.isPriceAllTimeLow = false;
                    game.isPriceOneYearTimeLow = false;
                }

                game.regularPrice = item.deals[0].regular.amount;
                game.priceExpiry = item.deals[0].expiry;
                game.currentPrice = item.deals[0].price.amount;
                game.urlToBuy = item.deals[0].url;

                await this.gameRepository.save(game);
            }
        } catch (error) {
            console.error("Erro ao sincronizar wishlist");
        }
    }

    async searchGameByName(gameName: string): Promise<Partial<Game[]> | null> {
        try {
            const gamesResponse: any = await axios.get(`https://api.isthereanydeal.com/games/search/v1?key=${config.itad.apiKey}&title=${gameName}`);

            return gamesResponse.data.map((game: any): Partial<Game> => {
                return {
                    id: game.id,
                    name: game.title,
                    image: game.assets.boxart
                };
            });
        } catch (error) {
            console.error("Error searching game in ITAD:", error);
            throw new Error("Failed to search game in ITAD");
        }
    }
}
