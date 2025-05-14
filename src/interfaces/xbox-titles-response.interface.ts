import { XboxTitle } from "./xbox-title.interface";

export interface XboxTitlesResponse {
    titles: XboxTitle[];
    pagingInfo: {
        continuationToken: string | null;
    };
}
