import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { BacklogScheduleScheduledGameMapper } from "../../contracts/mappers/backlog-schedule-list.mapper";
import { BacklogScheduleCompleteGameMapper } from "../../contracts/mappers/backlog-schedule-scheduled.mapper";
import { BacklogScheduleSaveRequestDto } from "../../domain/dtos/backlog-schedule-save-request.dto";
import { AuthGuard } from "../../infrastructure/guards/auth.guard";
import { BacklogScheduleService } from "./backlog-schedule.service";

@Controller("api/backlogSchedule")
export class BacklogScheduleController {
    constructor(private readonly backlogScheduleService: BacklogScheduleService) {}

    @Get("allCompleteFromYear")
    @UseGuards(AuthGuard)
    public async allCompleteFromYear(@Query("year") year: number) {
        const playedGames = await this.backlogScheduleService.allCompleteFromYear(year);

        return BacklogScheduleCompleteGameMapper(playedGames);
    }

    @Get("allScheduledFromYear")
    @UseGuards(AuthGuard)
    public async allScheduledFromYear(@Query("year") year: number) {
        const calendar = await this.backlogScheduleService.getScheduled(year);

        return BacklogScheduleScheduledGameMapper(calendar);
    }

    @Get("backlogUnscheduledItems")
    @UseGuards(AuthGuard)
    public async backlogUnscheduledItems() {
        const items = await this.backlogScheduleService.getBacklogUnscheduledItems();

        return items;
    }

    @Post("")
    @UseGuards(AuthGuard)
    public async save(@Body() request: BacklogScheduleSaveRequestDto) {
        const scheduleSaved = await this.backlogScheduleService.save(request);

        return scheduleSaved;
    }

    @Delete(":id")
    @UseGuards(AuthGuard)
    public async delete(@Param("id") id: string) {
        await this.backlogScheduleService.delete(id);

        return true;
    }

    @Get(":id")
    public async findById(@Param("id") id: string) {
        const schedule = await this.backlogScheduleService.findById(id);

        return schedule || {};
    }
}
