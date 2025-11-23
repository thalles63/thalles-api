import { AchievementSaveRequest } from "./achievement-save-request.dto";

export interface GameSaveRequest {
    id: string;
    achievements: AchievementSaveRequest[];
    name: string;
    description: string;
    image: string;
    screenshots: string[];
    banner: string[];
    rating: number;
    platform: number;
    timePlayed?: number;
    isPlatinumed: boolean;
    isCampaignComplete: boolean;
    status: number;
    dateCompleted: Date;
    releaseDate: Date;
    lastTimePlayed: Date;
    genres: string[];
    themes: string[];
    developer: string;
    publisher: string;
    completionistTime: number;
    mainExtrasTime: number;
    mainStoryTime: number;
}
