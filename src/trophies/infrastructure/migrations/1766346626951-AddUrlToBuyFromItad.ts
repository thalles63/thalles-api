import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUrlToBuyFromItad1766346626951 implements MigrationInterface {
    name = 'AddUrlToBuyFromItad1766346626951'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" ADD "urlToBuy" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "urlToBuy"`);
    }

}
