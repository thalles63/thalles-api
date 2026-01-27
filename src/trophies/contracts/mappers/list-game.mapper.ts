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
            regularPrice: Number(game.regularPrice ?? 0),
            priceExpiry: game.priceExpiry,
            isPriceAllTimeLow: game.isPriceAllTimeLow,
            isPriceOneYearTimeLow: game.isPriceOneYearTimeLow,
            urlToBuy: game.urlToBuy,
            timePlayed: game.timePlayed,
            achievements: game.achievements.length,
            earnedAchievements: game.achievements.filter((a) => a.isAchieved).length
        };

        gamesMapped.push(gameMapped);
    }

    return [gamesMapped, total];
};
