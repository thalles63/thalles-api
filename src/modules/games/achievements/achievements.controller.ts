import { Body, Controller, Delete, Param, Post, Put, UseGuards } from "@nestjs/common";
import type { AchievementSaveRequestDto } from "../../../domain/dtos/achievement-save-request.dto";
import { AuthGuard } from "../../../infrastructure/guards/auth.guard";
import { AchievementsService } from "./achievements.service";

@Controller("api/games/:gameId/achievements")
export class AchievementsController {
    constructor(private readonly achievementsService: AchievementsService) {}

    @Put(":id")
    @UseGuards(AuthGuard)
    async edit(@Param("id") id: string, @Param("gameId") gameId: string, @Body() achievement: AchievementSaveRequestDto) {
        const updatedAchievement = await this.achievementsService.edit(id, achievement, gameId);

        return updatedAchievement;
    }

    @Delete(":id")
    @UseGuards(AuthGuard)
    async delete(@Param("id") id: string) {
        await this.achievementsService.delete(id);

        return true;
    }

    @Post("saveFromSteam")
    @UseGuards(AuthGuard)
    async saveFromSteam(@Body() saveFromSteamParams: { platformId: string }, @Param("gameId") gameId: string) {
        const achievementsSaved = await this.achievementsService.saveFromSteam(gameId, saveFromSteamParams.platformId);

        return achievementsSaved;
    }

    @Post("saveFromPsnProfiles")
    @UseGuards(AuthGuard)
    async saveFromPsnProfiles(@Body() saveFromPsnProfilesParams: { gameUrl: string }, @Param("gameId") gameId: string) {
        const achievementsSaved = await this.achievementsService.saveFromPsnProfiles(gameId, saveFromPsnProfilesParams.gameUrl);

        return achievementsSaved;
    }

    @Post("saveFromRetroAchievements")
    @UseGuards(AuthGuard)
    async saveFromRetroAchievements(@Body() saveFromRetroAchievementsParams: { platformId: number }, @Param("gameId") gameId: string) {
        const achievementsSaved = await this.achievementsService.saveFromRetroAchievements(gameId, saveFromRetroAchievementsParams.platformId);

        return achievementsSaved;
    }
}
