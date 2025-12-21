import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOneYearTimeLowToGamePrices1766353042010 implements MigrationInterface {
    name = 'AddOneYearTimeLowToGamePrices1766353042010'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" ADD "isPriceOneYearTimeLow" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "isPriceOneYearTimeLow"`);
    }

}
