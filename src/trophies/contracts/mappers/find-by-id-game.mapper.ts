import { Game } from "../../domain/entities/games.entity";

export const FindByIdGameMapper = (game: Game) => {
    return {
        achievements:
            game.achievements?.map((a) => {
                if (a.dateAchieved?.toISOString() === "1970-01-01T00:00:00.000Z") {
                    a.dateAchieved = undefined!;
                }

                return a;
            }) || [],
        description: game.description,
        description_ptbr: game.description_ptbr,
        developer: game.developer,
        genres: game.genres,
        id: game.id,
        image: game.image,
        homeCoverType: game.homeCoverType,
        name: game.name,
        platform: game.platform,
        publisher: game.publisher,
        releaseDate: game.releaseDate,
        screenshots: game.screenshots?.length ? game.screenshots.split(",") : null,
        imageSteam: game.imageSteam,
        imageRawg: game.imageRawg,
        themes: game.themes,
        timePlayed: game.timePlayed,
        dateCompleted: game.dateCompleted,
        isPlatinumed: game.isPlatinumed,
        lastTimePlayed: game.lastTimePlayed,
        rating: game.rating,
        status: game.status,
        completionistTime: game.completionistTime,
        mainExtrasTime: game.mainExtrasTime,
        mainStoryTime: game.mainStoryTime,
        itadId: game.itadId,
        currentPrice: game.currentPrice,
        isPriceAllTimeLow: game.isPriceAllTimeLow,
        isPriceOneYearTimeLow: game.isPriceOneYearTimeLow,
        urlToBuy: game.urlToBuy,
        comments: game.comments
    };
};
