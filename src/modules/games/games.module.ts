import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Game } from "../../domain/entities/games.entity";
import { Genre } from "../../domain/entities/genre.entity";
import { Theme } from "../../domain/entities/theme.entity";
import { AchievementsModule } from "./achievements/achievements.module";
import { IgdbService } from "./external-services/igdb.service";
import { PsnProfilesService } from "./external-services/psn-profiles.service";
import { SteamService } from "./external-services/steam.service";
import { GamesController } from "./games.controller";
import { GamesService } from "./games.service";

@Module({
    imports: [TypeOrmModule.forFeature([Game, Genre, Theme]), AchievementsModule],
    controllers: [GamesController],
    providers: [GamesService, IgdbService, SteamService, PsnProfilesService]
})
export class GamesModule {}
