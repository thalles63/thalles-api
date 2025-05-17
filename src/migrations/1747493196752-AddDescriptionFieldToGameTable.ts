import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDescriptionFieldToGameTable1747493196752 implements MigrationInterface {
    name = 'AddDescriptionFieldToGameTable1747493196752'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" ADD "description" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "description"`);
    }

}
