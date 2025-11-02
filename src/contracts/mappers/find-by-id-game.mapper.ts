import { Game } from "../../domain/entities/games.entity";

export const FindByIdGameMapper = (game: Game) => {
    return {
        achievements: game.achievements.map((a) => {
            if (a.dateAchieved?.toISOString() === "1970-01-01T00:00:00.000Z") {
                a.dateAchieved = undefined!;
            }

            return a;
        }),
        description: game.description,
        developer: game.developer,
        genres: game.genres,
        id: game.id,
        image: game.image,
        name: game.name,
        platform: game.platform,
        publisher: game.publisher,
        releaseDate: game.releaseDate,
        screenshot: game.screenshot,
        themes: game.themes,
        timePlayed: game.timePlayed,
        dateCompleted: game.dateCompleted,
        isCampaignComplete: game.isCampaignComplete,
        isPlatinumed: game.isPlatinumed,
        lastTimePlayed: game.lastTimePlayed,
        rating: game.rating,
        status: game.status
    };
};
