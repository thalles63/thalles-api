export interface ListFilters {
    name: string;
    rating: number;
    platform: number | number[];
    isPlatinumed: boolean;
    isCampaignComplete: boolean;
    status?: number;
    genre: string;
    theme: string;
    releaseYear: number;
    page: number;
    sort: number;
    limit: number;
    completionYear: number;
}
