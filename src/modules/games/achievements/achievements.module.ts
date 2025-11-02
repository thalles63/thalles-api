import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Achievement } from "../../../domain/entities/achievements.entity";
import { Game } from "../../../domain/entities/games.entity";
import { PsnProfilesService } from "../external-services/psn-profiles.service";
import { SteamService } from "../external-services/steam.service";
import { AchievementsController } from "./achievements.controller";
import { AchievementsService } from "./achievements.service";

@Module({
    imports: [TypeOrmModule.forFeature([Achievement, Game])],
    controllers: [AchievementsController],
    providers: [AchievementsService, SteamService, PsnProfilesService],
    exports: [AchievementsService]
})
export class AchievementsModule {}
