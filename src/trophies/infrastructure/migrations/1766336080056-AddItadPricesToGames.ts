import { MigrationInterface, QueryRunner } from "typeorm";

export class AddItadPricesToGames1766336080056 implements MigrationInterface {
    name = 'AddItadPricesToGames1766336080056'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" ADD "itadId" character varying`);
        await queryRunner.query(`ALTER TABLE "games" ADD CONSTRAINT "UQ_758e0cb522168731107a1dc55e0" UNIQUE ("itadId")`);
        await queryRunner.query(`ALTER TABLE "games" ADD "currentPrice" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "games" ADD "isPriceAllTimeLow" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "isPriceAllTimeLow"`);
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "currentPrice"`);
        await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "UQ_758e0cb522168731107a1dc55e0"`);
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "itadId"`);
    }

}
