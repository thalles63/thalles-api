import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrmConnectionEnum } from "../../../../shared/enum/orm-connection.enum";
import { Achievement } from "../../../domain/entities/achievements.entity";
import { Game } from "../../../domain/entities/games.entity";
import { RetroAchievementsGames } from "../../../domain/entities/retroAchievementsGames.entity";
import { PsnProfilesService } from "../external-services/psn-profiles.service";
import { RetroAchievementsService } from "../external-services/retro-achievements.service";
import { SteamService } from "../external-services/steam.service";
import { AchievementsController } from "./achievements.controller";
import { AchievementsService } from "./achievements.service";

@Module({
    imports: [TypeOrmModule.forFeature([Achievement, Game, RetroAchievementsGames], OrmConnectionEnum.Trophies)],
    controllers: [AchievementsController],
    providers: [AchievementsService, SteamService, PsnProfilesService, RetroAchievementsService],
    exports: [AchievementsService]
})
export class AchievementsModule {}
