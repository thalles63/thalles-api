import { Module } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { ScheduleModule } from "@nestjs/schedule";
import { AuthModule } from "./modules/auth/auth.module";
import { BacklogScheduleModule } from "./modules/backlog-schedule/backlog-schedule.module";
import { FranchisesModule } from "./modules/franchises/franchises.module";
import { GamesModule } from "./modules/games/games.module";
import { MigrationModule } from "./modules/migration/migration.module";
import { PingModule } from "./modules/ping/ping.module";

@Module({
    imports: [EventEmitterModule.forRoot(), ScheduleModule.forRoot(), PingModule, AuthModule, GamesModule, BacklogScheduleModule, FranchisesModule, MigrationModule]
})
export class TrophiesModule {}
