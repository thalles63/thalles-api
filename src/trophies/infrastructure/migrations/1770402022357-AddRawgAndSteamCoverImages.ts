import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRawgAndSteamCoverImages1770402022357 implements MigrationInterface {
    name = 'AddRawgAndSteamCoverImages1770402022357'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "banner"`);
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "homeCover"`);
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "useHomeCoverFromRawg"`);
        await queryRunner.query(`ALTER TABLE "games" ADD "homeCoverType" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "games" ADD "imageSteam" character varying`);
        await queryRunner.query(`ALTER TABLE "games" ADD "imageRawg" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "imageRawg"`);
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "imageSteam"`);
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "homeCoverType"`);
        await queryRunner.query(`ALTER TABLE "games" ADD "useHomeCoverFromRawg" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "games" ADD "homeCover" character varying`);
        await queryRunner.query(`ALTER TABLE "games" ADD "banner" character varying`);
    }

}
