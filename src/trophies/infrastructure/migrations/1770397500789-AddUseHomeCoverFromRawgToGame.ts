import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUseHomeCoverFromRawgToGame1770397500789 implements MigrationInterface {
    name = 'AddUseHomeCoverFromRawgToGame1770397500789'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" ADD "useHomeCoverFromRawg" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "useHomeCoverFromRawg"`);
    }

}
