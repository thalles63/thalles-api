import { Game } from "../../domain/entities/games.entity";

export const ListGameMapper = (games: Game[], total: any) => {
    const gamesMapped: any = [];

    for (const game of games) {
        const gameMapped = {
            id: game.id,
            image: game.image,
            name: game.name,
            platform: game.platform,
            lastTimePlayed: game.lastTimePlayed,
            rating: game.rating,
            status: game.status,
            currentPrice: Number(game.currentPrice ?? 0),
            isPriceAllTimeLow: game.isPriceAllTimeLow,
            isPriceOneYearTimeLow: game.isPriceOneYearTimeLow,
            urlToBuy: game.urlToBuy
        };

        gamesMapped.push(gameMapped);
    }

    return [gamesMapped, total];
};
