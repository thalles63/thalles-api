import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeRatingFieldPrecision1747695257108 implements MigrationInterface {
    name = 'ChangeRatingFieldPrecision1747695257108'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" ALTER COLUMN "rating" TYPE numeric(5,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" ALTER COLUMN "rating" TYPE numeric(2,2)`);
    }

}
