import { AchievementSaveRequestDto } from "../../domain/dtos/achievement-save-request.dto";
import { Achievement } from "../../domain/entities/achievements.entity";

export const SaveAchievementMapper = (achievement: Achievement, requestAchievement: AchievementSaveRequestDto, gameId: string) => {
    const requestAchievementTransformed = {
        gameId: gameId,
        description: requestAchievement.description,
        image: requestAchievement.image,
        name: requestAchievement.name,
        type: requestAchievement.type ?? "0",
        isAchieved: requestAchievement.isAchieved,
        dateAchieved: requestAchievement.dateAchieved,
        percentageAchieved: Number(requestAchievement.percentageAchieved ?? 0)
    };

    return <Achievement>{ ...achievement, ...requestAchievementTransformed };
};
