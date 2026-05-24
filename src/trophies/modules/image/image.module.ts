import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrmConnectionEnum } from "../../../shared/enum/orm-connection.enum";
import { Achievement } from "../../domain/entities/achievements.entity";
import { Game } from "../../domain/entities/games.entity";
import { CloudinaryService } from "./cloudinary.service";
import { ImageUploadListener } from "./image-upload.listener";

@Module({
    imports: [TypeOrmModule.forFeature([Game, Achievement], OrmConnectionEnum.Trophies)],
    providers: [CloudinaryService, ImageUploadListener],
    exports: [CloudinaryService]
})
export class ImageModule {}
