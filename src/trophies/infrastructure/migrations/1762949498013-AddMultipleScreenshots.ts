import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMultipleScreenshots1762949498013 implements MigrationInterface {
    name = "AddMultipleScreenshots1762949498013";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" ADD "screenshots" character varying`);
        await queryRunner.query(`ALTER TABLE "games" ADD "banner" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "banner"`);
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "screenshots"`);
    }
}
