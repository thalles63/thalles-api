import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPlatformIdToAchievementTable1747069233383 implements MigrationInterface {
    name = 'AddPlatformIdToAchievementTable1747069233383'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "achievements" ADD "platformId" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "achievements" DROP COLUMN "platformId"`);
    }

}
