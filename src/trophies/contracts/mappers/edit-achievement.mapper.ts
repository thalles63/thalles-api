import { AchievementSaveRequestDto } from "../../domain/dtos/achievement-save-request.dto";
import { Achievement } from "../../domain/entities/achievements.entity";

export const EditAchievementMapper = (achievement: Achievement, requestAchievement: AchievementSaveRequestDto) => {
    return <Achievement>{ ...achievement, ...requestAchievement };
};
