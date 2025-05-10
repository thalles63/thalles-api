import { MigrationInterface, QueryRunner } from "typeorm";

export class AddScreenshotFieldToGameTable1746889525689 implements MigrationInterface {
    name = 'AddScreenshotFieldToGameTable1746889525689'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" ADD "screenshot" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "screenshot"`);
    }

}
