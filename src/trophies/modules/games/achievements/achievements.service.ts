import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OrmConnectionEnum } from "../../../../shared/enum/orm-connection.enum";
import { EditAchievementMapper } from "../../../contracts/mappers/edit-achievement.mapper";
import { SaveAchievementMapper } from "../../../contracts/mappers/save-achievement.mapper";
import { AchievementSaveRequestDto } from "../../../domain/dtos/achievement-save-request.dto";
import { Achievement } from "../../../domain/entities/achievements.entity";
import { Game } from "../../../domain/entities/games.entity";
import { CloudinaryService } from "../../image/cloudinary.service";
import { ImageUploadEvent } from "../../image/image-upload.listener";
import { PsnProfilesService } from "../external-services/psn-profiles.service";
import { RetroAchievementsService } from "../external-services/retro-achievements.service";
import { SteamService } from "../external-services/steam.service";

@Injectable()
export class AchievementsService {
    constructor(
        @InjectRepository(Achievement, OrmConnectionEnum.Trophies) private readonly achievementRepository: Repository<Achievement>,
        @InjectRepository(Game, OrmConnectionEnum.Trophies) private readonly gameRepository: Repository<Game>,
        private readonly steamService: SteamService,
        private readonly psnProfilesService: PsnProfilesService,
        private readonly retroAchievementsService: RetroAchievementsService,
        private readonly eventEmitter: EventEmitter2,
        private readonly cloudinaryService: CloudinaryService
    ) {}

    public async listFromGame(gameId: string) {
        try {
            const achievements = await this.achievementRepository.findBy({ gameId });
            return achievements;
        } catch (error) {
            throw new BadRequestException(`Failed to load achievements: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    public async edit(id: string, achievementData: AchievementSaveRequestDto, gameId: string) {
        try {
            const dbAchievement = await this.achievementRepository.findOneBy({ id });

            if (!dbAchievement) {
                throw new NotFoundException("Achievement not found");
            }

            const updatedAchievement = await this.achievementRepository.save(EditAchievementMapper(dbAchievement, achievementData));

            if (updatedAchievement.dateAchieved) {
                const latest = await this.achievementRepository
                    .createQueryBuilder("a")
                    .select("MAX(a.dateAchieved)", "latest")
                    .where("a.gameId = :gameId", { gameId })
                    .getRawOne();

                await this.gameRepository.update({ id: gameId }, { lastTimePlayed: latest.latest });
            }

            this.emitAchievementImageEvent(id, achievementData.image, gameId);
            return updatedAchievement;
        } catch (error) {
            throw new BadRequestException(`Failed to edit achievement: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    async delete(id: string) {
        try {
            return await this.achievementRepository.delete(id);
        } catch (error) {
            throw new BadRequestException(`Failed to delete achievement: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    async saveFromSteam(gameId: string, steamId: string): Promise<Achievement[]> {
        try {
            const achievements = await this.steamService.getListOfAchievements(steamId);
            const achievementPercentages = await this.steamService.getAchievementPercentages(steamId);

            const achievementsList: Achievement[] = [];
            for (const achievement of achievements) {
                achievement.percentageAchieved = (achievementPercentages.find((p) => p.name === achievement.platformId)?.percent as any) || 0;
                const newAchievement = this.achievementRepository.create(SaveAchievementMapper(<Achievement>{}, achievement, gameId));

                achievementsList.push(newAchievement);
            }

            const saved = await this.achievementRepository.save(achievementsList);
            saved.forEach((a) => this.emitAchievementImageEvent(a.id, a.image, gameId));
            return saved;
        } catch (error) {
            throw new BadRequestException(`Failed to save achievements: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    async saveFromPsnProfiles(gameId: string, gameUrl: string) {
        try {
            const psnAchievements = await this.psnProfilesService.getAchievementsFromPsn(gameUrl);

            const achievementsList = [];
            for (const achievement of psnAchievements!) {
                const newAchievement = this.achievementRepository.create(SaveAchievementMapper(<Achievement>{}, achievement, gameId));

                achievementsList.push(newAchievement);
            }

            const saved = await this.achievementRepository.save(achievementsList);
            saved.forEach((a) => this.emitAchievementImageEvent(a.id, a.image, gameId));
            return saved;
        } catch (error) {
            throw new BadRequestException(`Failed to save achievements: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    async saveFromRetroAchievements(gameId: string, retroAchievementsId: number) {
        try {
            const retroAchievements = await this.retroAchievementsService.getAchievements(retroAchievementsId);

            const achievementsList = [];
            for (const achievement of retroAchievements!) {
                const newAchievement = this.achievementRepository.create(SaveAchievementMapper(<Achievement>{}, achievement, gameId));

                achievementsList.push(newAchievement);
            }

            const saved = await this.achievementRepository.save(achievementsList);
            saved.forEach((a) => this.emitAchievementImageEvent(a.id, a.image, gameId));
            return saved;
        } catch (error) {
            throw new BadRequestException(`Failed to save achievements: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    private emitAchievementImageEvent(achievementId: string, url: string | undefined | null, gameId: string) {
        if (url && !this.cloudinaryService.isCloudinaryUrl(url)) {
            this.eventEmitter.emit("image.upload", <ImageUploadEvent>{ entityId: achievementId, entityType: "achievement", imageKey: "icon", url, gameId });
        }
    }

    async findMostRecentAchievedByGame(gameId: string) {
        return await this.achievementRepository
            .createQueryBuilder("achievements")
            .select("MAX(achievements.dateAchieved)", "dateAchieved")
            .where("achievements.gameId = :gameId", { gameId })
            .getRawOne();
    }
}
