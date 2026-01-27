export const HowLongToBeatQueryData = {
    searchType: "games",
    searchTerms: [""],
    searchPage: 1,
    size: 20,
    searchOptions: {
        games: {
            userId: 0,
            platform: "",
            sortCategory: "popular",
            rangeCategory: "main",
            rangeTime: {
                min: null,
                max: null
            },
            gameplay: {
                perspective: "",
                flow: "",
                genre: "",
                difficulty: ""
            },
            rangeYear: {
                min: "",
                max: ""
            },
            modifier: ""
        },
        users: {
            sortCategory: "postcount"
        },
        lists: {
            sortCategory: "follows"
        },
        filter: "",
        sort: 0,
        randomizer: 0,
        useCache: true
    }
};
