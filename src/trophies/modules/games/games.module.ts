import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrmConnectionEnum } from "../../../shared/enum/orm-connection.enum";
import { BacklogSchedule } from "../../domain/entities/backlog-schedule.entity";
import { Franchise } from "../../domain/entities/franchise.entity";
import { Game } from "../../domain/entities/games.entity";
import { Genre } from "../../domain/entities/genre.entity";
import { RetroAchievementsGames } from "../../domain/entities/retroAchievementsGames.entity";
import { Theme } from "../../domain/entities/theme.entity";
import { AchievementsModule } from "./achievements/achievements.module";
import { IgdbService } from "./external-services/igdb.service";
import { ItadService } from "./external-services/itad.service";
import { PsnProfilesService } from "./external-services/psn-profiles.service";
import { RawgService } from "./external-services/rawg.service";
import { RetroAchievementsService } from "./external-services/retro-achievements.service";
import { SteamService } from "./external-services/steam.service";
import { TranslationService } from "./external-services/translation.service";
import { GamesController } from "./games.controller";
import { GamesService } from "./games.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Game, Genre, Theme, RetroAchievementsGames, BacklogSchedule, Franchise], OrmConnectionEnum.Trophies),
        AchievementsModule,
        HttpModule
    ],
    controllers: [GamesController],
    providers: [GamesService, IgdbService, SteamService, PsnProfilesService, RetroAchievementsService, ItadService, TranslationService, RawgService]
})
export class GamesModule {}
