export interface SteamAchievement {
    platformId: string;
    name: string;
    description: string;
    type: number;
    image: string;
    isAchieved: boolean;
    percentageAchieved: number;
}
