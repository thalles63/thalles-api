import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewFieldsToAchievementTable1747070452736 implements MigrationInterface {
    name = 'AddNewFieldsToAchievementTable1747070452736'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "achievements" ADD "type" character varying`);
        await queryRunner.query(`ALTER TABLE "achievements" ADD "isAchieved" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "achievements" ADD "dateAchieved" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "achievements" DROP COLUMN "dateAchieved"`);
        await queryRunner.query(`ALTER TABLE "achievements" DROP COLUMN "isAchieved"`);
        await queryRunner.query(`ALTER TABLE "achievements" DROP COLUMN "type"`);
    }

}
