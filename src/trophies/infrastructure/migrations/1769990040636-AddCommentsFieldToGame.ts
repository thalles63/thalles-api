import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCommentsFieldToGame1769990040636 implements MigrationInterface {
    name = 'AddCommentsFieldToGame1769990040636'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" ADD "comments" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "comments"`);
    }

}
