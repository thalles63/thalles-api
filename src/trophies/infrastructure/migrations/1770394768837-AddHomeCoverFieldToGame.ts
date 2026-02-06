import { MigrationInterface, QueryRunner } from "typeorm";

export class AddHomeCoverFieldToGame1770394768837 implements MigrationInterface {
    name = "AddHomeCoverFieldToGame1770394768837";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "achievements" DROP CONSTRAINT "FK_achievements_games_cascade"`);
        await queryRunner.query(`ALTER TABLE "games" ADD "homeCover" character varying`);
        await queryRunner.query(
            `ALTER TABLE "achievements" ADD CONSTRAINT "FK_e8aac7dad522b2f75e393e684ac" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "achievements" DROP CONSTRAINT "FK_e8aac7dad522b2f75e393e684ac"`);
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "homeCover"`);
        await queryRunner.query(
            `ALTER TABLE "achievements" ADD CONSTRAINT "FK_achievements_games_cascade" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
        );
    }
}
