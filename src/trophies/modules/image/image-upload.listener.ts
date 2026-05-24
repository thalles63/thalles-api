import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OrmConnectionEnum } from "../../../shared/enum/orm-connection.enum";
import { Achievement } from "../../domain/entities/achievements.entity";
import { Game } from "../../domain/entities/games.entity";
import { CloudinaryService } from "./cloudinary.service";

export interface ImageUploadEvent {
    entityId: string;
    entityType: "game" | "achievement";
    imageKey: string;
    url: string;
    gameId?: string; // obrigatório quando entityType === "achievement"
}

@Injectable()
export class ImageUploadListener {
    private readonly logger = new Logger(ImageUploadListener.name);

    constructor(
        private readonly cloudinaryService: CloudinaryService,
        @InjectRepository(Game, OrmConnectionEnum.Trophies) private readonly gameRepository: Repository<Game>,
        @InjectRepository(Achievement, OrmConnectionEnum.Trophies) private readonly achievementRepository: Repository<Achievement>
    ) {}

    @OnEvent("image.upload", { async: true })
    async handleImageUpload(event: ImageUploadEvent) {
        const { entityId, entityType, imageKey, url } = event;

        if (!url || this.cloudinaryService.isCloudinaryUrl(url)) {
            return;
        }

        try {
            const publicId =
                entityType === "game"
                    ? this.cloudinaryService.gamePublicId(entityId, imageKey)
                    : this.cloudinaryService.achievementPublicId(event.gameId!, entityId);

            const cloudinaryUrl = await this.cloudinaryService.uploadFromUrl(url, publicId);

            if (entityType === "game") {
                if (imageKey.startsWith("screenshot_")) {
                    // Usa REPLACE() atômico para evitar race condition:
                    // múltiplos screenshots sobem em paralelo e um read-modify-write
                    // faria cada listener sobrescrever o que o anterior gravou.
                    // O REPLACE() opera na URL original como chave, sem precisar ler o CSV.
                    await this.gameRepository
                        .createQueryBuilder()
                        .update(Game)
                        .set({ screenshots: () => "REPLACE(screenshots, :old, :new)" })
                        .setParameters({ old: url, new: cloudinaryUrl })
                        .where("id = :id", { id: entityId })
                        .execute();
                } else {
                    await this.gameRepository.update({ id: entityId }, { [imageKey]: cloudinaryUrl });
                }
            } else {
                await this.achievementRepository.update({ id: entityId }, { image: cloudinaryUrl });
            }

            this.logger.log(`Uploaded ${publicId} → ${cloudinaryUrl}`);
        } catch (error) {
            this.logger.error(`Failed to upload ${entityType}/${entityId}/${imageKey}: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
        }
    }
}
