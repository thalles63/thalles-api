import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoleToAdmin1775100000000 implements MigrationInterface {
    name = 'AddRoleToAdmin1775100000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin" ADD "role" character varying NOT NULL DEFAULT 'admin'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin" DROP COLUMN "role"`);
    }
}
