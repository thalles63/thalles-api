import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeGameColumnsNullable1762103995029 implements MigrationInterface {
    name = 'MakeGameColumnsNullable1762103995029'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" ALTER COLUMN "image" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "games" ALTER COLUMN "platform" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" ALTER COLUMN "platform" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "games" ALTER COLUMN "image" SET NOT NULL`);
    }

}
