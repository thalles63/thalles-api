import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusFieldToGameTable1747506247053 implements MigrationInterface {
    name = 'AddStatusFieldToGameTable1747506247053'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" ADD "status" integer NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "status"`);
    }

}
