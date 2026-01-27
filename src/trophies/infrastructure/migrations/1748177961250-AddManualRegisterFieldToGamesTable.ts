import { MigrationInterface, QueryRunner } from "typeorm";

export class AddManualRegisterFieldToGamesTable1748177961250 implements MigrationInterface {
    name = 'AddManualRegisterFieldToGamesTable1748177961250'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" ADD "isManualRegister" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "isManualRegister"`);
    }

}
