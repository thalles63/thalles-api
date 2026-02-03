import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDescriptionPtBrToAchievement1770078193816 implements MigrationInterface {
    name = 'AddDescriptionPtBrToAchievement1770078193816'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "achievements" ADD "description_ptbr" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "achievements" DROP COLUMN "description_ptbr"`);
    }

}
