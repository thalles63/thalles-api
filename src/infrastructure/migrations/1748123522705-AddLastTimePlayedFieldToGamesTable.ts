import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLastTimePlayedFieldToGamesTable1748123522705 implements MigrationInterface {
    name = 'AddLastTimePlayedFieldToGamesTable1748123522705'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" ADD "lastTimePlayed" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "lastTimePlayed"`);
    }

}
