import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateHLTBTimeFields1763906514049 implements MigrationInterface {
    name = 'CreateHLTBTimeFields1763906514049'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" ADD "completionistTime" integer`);
        await queryRunner.query(`ALTER TABLE "games" ADD "mainExtrasTime" integer`);
        await queryRunner.query(`ALTER TABLE "games" ADD "mainStoryTime" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "mainStoryTime"`);
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "mainExtrasTime"`);
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "completionistTime"`);
    }

}
