import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrmConnectionEnum } from "../../../../shared/enum/orm-connection.enum";
import { Achievement } from "../../../domain/entities/achievements.entity";
import { Game } from "../../../domain/entities/games.entity";
import { RetroAchievementsGames } from "../../../domain/entities/retroAchievementsGames.entity";
import { ImageModule } from "../../image/image.module";
import { ExophaseService } from "../external-services/exophase.service";
import { RetroAchievementsService } from "../external-services/retro-achievements.service";
import { SteamService } from "../external-services/steam.service";
import { AchievementsController } from "./achievements.controller";
import { AchievementsService } from "./achievements.service";

@Module({
    imports: [TypeOrmModule.forFeature([Achievement, Game, RetroAchievementsGames], OrmConnectionEnum.Trophies), ImageModule],
    controllers: [AchievementsController],
    providers: [AchievementsService, SteamService, ExophaseService, RetroAchievementsService],
    exports: [AchievementsService]
})
export class AchievementsModule {}
