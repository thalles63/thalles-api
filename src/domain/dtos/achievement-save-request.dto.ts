export interface AchievementSaveRequest {
    id: string;
    name: string;
    description: string;
    type: string;
    image: string;
    isAchieved: boolean;
    dateAchieved?: Date;
    percentageAchieved: number;
    platformId?: string;
    gameId: string;
}
