import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BacklogSchedule } from "../../domain/entities/backlog-schedule.entity";
import { Game } from "../../domain/entities/games.entity";
import { BacklogScheduleController } from "./backlog-schedule.controller";
import { BacklogScheduleService } from "./backlog-schedule.service";

@Module({
    imports: [TypeOrmModule.forFeature([Game, BacklogSchedule])],
    controllers: [BacklogScheduleController],
    providers: [BacklogScheduleService]
})
export class BacklogScheduleModule {}
