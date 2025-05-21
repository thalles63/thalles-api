import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeRatingFieldTypeToDecimal1747695114192 implements MigrationInterface {
    name = 'ChangeRatingFieldTypeToDecimal1747695114192'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "rating"`);
        await queryRunner.query(`ALTER TABLE "games" ADD "rating" numeric(2,2) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "rating"`);
        await queryRunner.query(`ALTER TABLE "games" ADD "rating" integer NOT NULL`);
    }

}
