import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPsnIdToGamesTable1748097910147 implements MigrationInterface {
    name = 'AddPsnIdToGamesTable1748097910147'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" ADD "psnId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "psnId"`);
    }

}
