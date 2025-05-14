import { XboxAchievement } from "./xbox-achievement.interface";

export interface XboxAchievementsResponse {
    achievements: XboxAchievement[];
    pagingInfo: {
        continuationToken: string | null;
    };
}
