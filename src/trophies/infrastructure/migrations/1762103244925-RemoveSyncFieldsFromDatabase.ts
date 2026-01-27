import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveSyncFieldsFromDatabase1762103244925 implements MigrationInterface {
    name = 'RemoveSyncFieldsFromDatabase1762103244925'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "igdbId"`);
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "platformId"`);
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "lastUnlock"`);
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "psnId"`);
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "isManualRegister"`);
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "retroConsole"`);
        await queryRunner.query(`ALTER TABLE "achievements" DROP COLUMN "platformId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "achievements" ADD "platformId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "games" ADD "retroConsole" integer`);
        await queryRunner.query(`ALTER TABLE "games" ADD "isManualRegister" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "games" ADD "psnId" character varying`);
        await queryRunner.query(`ALTER TABLE "games" ADD "lastUnlock" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "games" ADD "platformId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "games" ADD "igdbId" character varying NOT NULL`);
    }

}
