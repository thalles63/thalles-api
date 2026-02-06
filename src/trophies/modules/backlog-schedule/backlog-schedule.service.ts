import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OrmConnectionEnum } from "../../../shared/enum/orm-connection.enum";
import { BacklogScheduleSaveRequestDto } from "../../domain/dtos/backlog-schedule-save-request.dto";
import { BacklogSchedule } from "../../domain/entities/backlog-schedule.entity";
import { Game } from "../../domain/entities/games.entity";
import { StatusEnum } from "../../domain/enums/status.enum";

@Injectable()
export class BacklogScheduleService {
    constructor(
        @InjectRepository(Game, OrmConnectionEnum.Trophies) private readonly gameRepository: Repository<Game>,
        @InjectRepository(BacklogSchedule, OrmConnectionEnum.Trophies) private readonly backlogScheduleRepository: Repository<BacklogSchedule>
    ) {}

    public async allCompleteFromYear(year: number) {
        const query = this.gameRepository
            .createQueryBuilder("games")
            .addSelect("games.id, games.name, games.lastTimePlayed, games.image, games.timePlayed")
            .addSelect("EXTRACT(MONTH FROM games.lastTimePlayed)", "month")
            .where("games.status = :statusComplete", { statusComplete: StatusEnum.Completed })
            .andWhere("EXTRACT(YEAR FROM games.lastTimePlayed) = :year", { year });

        return await query.getRawMany();
    }

    public async getScheduled(year: number) {
        const query = this.backlogScheduleRepository.createQueryBuilder("bs").leftJoinAndSelect("bs.game", "game").where("bs.year = :year", { year });

        return await query.getMany();
    }

    public async getBacklogUnscheduledItems() {
        let query = this.gameRepository
            .createQueryBuilder("games")
            .leftJoin(BacklogSchedule, "bs", "bs.gameId = games.id")
            .where("games.status = :status", { status: StatusEnum.Backlog })
            .andWhere("bs.id IS NULL")
            .select(["games.id", "games.name", "games.mainStoryTime"])
            .orderBy("name");

        const backlogGames = await query.getMany();

        return backlogGames;
    }

    public async save(schedule: BacklogScheduleSaveRequestDto) {
        try {
            const newSchedule = await this.backlogScheduleRepository.save(this.backlogScheduleRepository.create(schedule));

            return newSchedule;
        } catch (error) {
            throw new BadRequestException(`Failed to save game: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    public async delete(id: string) {
        try {
            const schedule = await this.backlogScheduleRepository.findOneBy({ id });

            await this.backlogScheduleRepository.delete(id);

            return true;
        } catch (error) {
            throw new BadRequestException(`Failed to delete game: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }

    public async findById(gameId: string) {
        return await this.backlogScheduleRepository.createQueryBuilder("bs").leftJoinAndSelect("bs.game", "game").where("bs.id = :gameId", { gameId }).getOne();
    }
}
