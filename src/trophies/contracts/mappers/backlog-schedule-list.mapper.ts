export const BacklogScheduleScheduledGameMapper = (games: any[]) => {
    const gamesMapped: any = [];

    for (const game of games) {
        const gameMapped = {
            id: game.id,
            gameId: game.game.id,
            image: game.game.image,
            name: game.game.name,
            month: game.month,
            order: game.order,
            mainStoryTime: game.game.mainStoryTime * 60
        };

        gamesMapped.push(gameMapped);
    }

    return gamesMapped;
};
