import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrmConnectionEnum } from "../../../shared/enum/orm-connection.enum";
import { Achievement } from "../../domain/entities/achievements.entity";
import { Game } from "../../domain/entities/games.entity";
import { ImageModule } from "../image/image.module";
import { MigrationController } from "./migration.controller";
import { MigrationService } from "./migration.service";

@Module({
    imports: [TypeOrmModule.forFeature([Game, Achievement], OrmConnectionEnum.Trophies), ImageModule],
    controllers: [MigrationController],
    providers: [MigrationService]
})
export class MigrationModule {}
