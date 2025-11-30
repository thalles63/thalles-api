import { MigrationInterface, QueryRunner } from "typeorm";
import { Playstation2Games } from "../retro-games-data/playstation2";

export class CreateAndPopulateRetroAchievementsGamesTable1764465396814 implements MigrationInterface {
    name = "CreateAndPopulateRetroAchievementsGamesTable1764465396814";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "retroAchievementsGames" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "platform" integer NOT NULL, "games" jsonb NOT NULL, CONSTRAINT "PK_819f58f5c4616a4ea2e56e474ed" PRIMARY KEY ("id"))`
        );

        const insertQuery = `
            INSERT INTO "retroAchievementsGames" ("platform", "games")
            VALUES ($1, $2)
        `;

        await queryRunner.query(insertQuery, [9, JSON.stringify(Playstation2Games)]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "retroAchievementsGames"`);
    }
}
