export interface XboxAchievement {
    id: string;
    name: string;
    description: string;
    progressState: string;
    rewards: {
        value: string;
    }[];
    progression: {
        timeUnlocked: Date;
    };
}
