export const BacklogScheduleCompleteGameMapper = (games: any[]) => {
    const gamesMapped: any = [];

    for (const game of games) {
        const gameMapped = {
            id: game.id,
            image: game.image,
            name: game.name,
            lastTimePlayed: game.lastTimePlayed,
            timePlayed: game.timePlayed,
            month: Number(game.month)
        };

        gamesMapped.push(gameMapped);
    }

    return gamesMapped;
};
