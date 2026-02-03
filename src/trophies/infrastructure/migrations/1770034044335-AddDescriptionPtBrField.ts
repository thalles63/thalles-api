import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDescriptionPtBrField1770034044335 implements MigrationInterface {
    name = 'AddDescriptionPtBrField1770034044335'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" ADD "description_ptbr" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "description_ptbr"`);
    }

}
