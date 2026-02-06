import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCascadeToAchievements1770387811943 implements MigrationInterface {
    name = "AddCascadeToAchievements1770387811943";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "achievements" DROP CONSTRAINT "FK_e8aac7dad522b2f75e393e684ac"`);
        await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "UQ_758e0cb522168731107a1dc55e0"`);
        await queryRunner.query(
            `ALTER TABLE "achievements" ADD CONSTRAINT "FK_achievements_games_cascade" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
        );
        await queryRunner.query(`DELETE FROM "games" WHERE "deletedAt" IS NOT NULL`);
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "deletedAt"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "achievements" DROP CONSTRAINT "FK_e8aac7dad522b2f75e393e684ac"`);
        await queryRunner.query(`ALTER TABLE "games" ADD CONSTRAINT "UQ_758e0cb522168731107a1dc55e0" UNIQUE ("itadId")`);
        await queryRunner.query(`ALTER TABLE "games" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(
            `ALTER TABLE "achievements" ADD CONSTRAINT "FK_e8aac7dad522b2f75e393e684ac" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }
}
