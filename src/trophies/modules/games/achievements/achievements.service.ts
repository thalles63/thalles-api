import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OrmConnectionEnum } from "../../../../shared/enum/orm-connection.enum";
import { EditAchievementMapper } from "../../../contracts/mappers/edit-achievement.mapper";
import { SaveAchievementMapper } from "../../../contracts/mappers/save-achievement.mapper";
import { AchievementSaveRequestDto } from "../../../domain/dtos/achievement-save-request.dto";
import { Achievement } from "../../../domain/entities/achievements.entity";
import { Game } from "../../../domain/entities/games.entity";
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
        private readonly retroAchievementsService: RetroAchievementsService
    ) {}

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

            return await this.achievementRepository.save(achievementsList);
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

            return await this.achievementRepository.save(achievementsList);
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

            return await this.achievementRepository.save(achievementsList);
        } catch (error) {
            throw new BadRequestException(`Failed to save achievements: ${error instanceof Error ? error.message : "Unknown error"}`);
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
