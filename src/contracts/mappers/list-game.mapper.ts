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
            status: game.status
        };

        gamesMapped.push(gameMapped);
    }

    return [gamesMapped, total];
};
