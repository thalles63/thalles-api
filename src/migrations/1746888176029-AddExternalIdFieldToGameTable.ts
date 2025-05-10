import { MigrationInterface, QueryRunner } from "typeorm";

export class AddExternalIdFieldToGameTable1746888176029 implements MigrationInterface {
    name = 'AddExternalIdFieldToGameTable1746888176029'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" ADD "externalGameId" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "externalGameId"`);
    }

}
