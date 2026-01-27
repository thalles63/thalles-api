import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeGameDefaultStatus1766343658375 implements MigrationInterface {
    name = 'ChangeGameDefaultStatus1766343658375'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" ALTER COLUMN "status" SET DEFAULT '6'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" ALTER COLUMN "status" SET DEFAULT '1'`);
    }

}
