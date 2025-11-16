import { In, Repository } from "typeorm";
import { GameSaveRequest } from "../../domain/dtos/game-save-request.dto";
import { Game } from "../../domain/entities/games.entity";
import { Genre } from "../../domain/entities/genre.entity";
import { Theme } from "../../domain/entities/theme.entity";
import { StatusEnum } from "../../domain/enums/status.enum";

export const SaveGameMapper = async (
    game: Game,
    requestGame: GameSaveRequest,
    genreRepository: Repository<Genre>,
    themeRepository: Repository<Theme>,
    mostRecentAchievementDate?: Date
) => {
    const requestGameTransformed = {
        description: requestGame.description,
        developer: requestGame.developer,
        genres: await getGenres(requestGame.genres, genreRepository),
        image: requestGame.image,
        name: requestGame.name,
        platform: requestGame.platform,
        publisher: requestGame.publisher,
        releaseDate: requestGame.releaseDate,
        screenshots: requestGame.screenshots ? requestGame.screenshots.join(",") : null,
        themes: await getThemes(requestGame.themes, themeRepository),
        status: requestGame.status,
        timePlayed: requestGame.timePlayed ?? 0,
        isPlatinumed: requestGame.isPlatinumed,
        isCampaignComplete: requestGame.isCampaignComplete,
        dateCompleted: requestGame.dateCompleted,
        rating: requestGame.rating,
        lastTimePlayed:
            requestGame.status === StatusEnum.Completed || requestGame.status === StatusEnum.Playing
                ? mostRecentAchievementDate || requestGame.lastTimePlayed
                : null
    };
    return <Game>{ ...game, ...requestGameTransformed };
};

const getGenres = async (genres: string[], genreRepository: Repository<Genre>) => {
    if (!genres) {
        return [];
    }

    const genresFromDb = await genreRepository.findBy({
        slug: In(genres || [])
    });

    return genresFromDb;
};

const getThemes = async (themes: string[], genreRepository: Repository<Theme>) => {
    if (!themes) {
        return [];
    }
    const themesFromDb = await genreRepository.findBy({
        slug: In(themes || [])
    });

    return themesFromDb;
};
