import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLastUnlockFieldToGameTable1747412165577 implements MigrationInterface {
    name = 'AddLastUnlockFieldToGameTable1747412165577'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" ADD "lastUnlock" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "lastUnlock"`);
    }

}
