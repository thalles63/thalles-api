import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedGameIdColumnToAchievementsTable1747004238099 implements MigrationInterface {
    name = 'AddedGameIdColumnToAchievementsTable1747004238099'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "achievements" DROP CONSTRAINT "FK_e8aac7dad522b2f75e393e684ac"`);
        await queryRunner.query(`ALTER TABLE "achievements" ALTER COLUMN "gameId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "achievements" ADD CONSTRAINT "FK_e8aac7dad522b2f75e393e684ac" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "achievements" DROP CONSTRAINT "FK_e8aac7dad522b2f75e393e684ac"`);
        await queryRunner.query(`ALTER TABLE "achievements" ALTER COLUMN "gameId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "achievements" ADD CONSTRAINT "FK_e8aac7dad522b2f75e393e684ac" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
