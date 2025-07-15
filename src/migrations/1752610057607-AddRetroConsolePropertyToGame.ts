import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRetroConsolePropertyToGame1752610057607 implements MigrationInterface {
    name = 'AddRetroConsolePropertyToGame1752610057607'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" ADD "retroConsole" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "retroConsole"`);
    }

}
