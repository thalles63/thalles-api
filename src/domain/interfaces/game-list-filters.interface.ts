export interface GameListFilters {
    limit: number;
    page: number;
    sort: number;
    status?: number;
    name: string;
    platform: number[];
    isCampaignComplete: boolean;
    isPlatinumed: boolean;
    rating: number;
    releaseYear: number;
    completionYear: number;
}
