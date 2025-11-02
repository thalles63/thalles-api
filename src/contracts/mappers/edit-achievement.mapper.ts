import { AchievementSaveRequest } from "../../domain/dtos/achievement-save-request.dto";
import { Achievement } from "../../domain/entities/achievements.entity";

export const EditAchievementMapper = (achievement: Achievement, requestAchievement: AchievementSaveRequest) => {
    const achiev = {
        id: requestAchievement.id,
        name: requestAchievement.name,
        description: requestAchievement.description,
        type: requestAchievement.type,
        image: requestAchievement.image,
        isAchieved: requestAchievement.isAchieved,
        dateAchieved: requestAchievement.dateAchieved,
        percentageAchieved: requestAchievement.percentageAchieved,
        gameId: requestAchievement.gameId
    };

    return <Achievement>{ ...achievement, ...achiev };
};
