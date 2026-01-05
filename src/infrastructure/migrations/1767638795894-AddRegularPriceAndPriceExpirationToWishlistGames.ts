import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRegularPriceAndPriceExpirationToWishlistGames1767638795894 implements MigrationInterface {
    name = 'AddRegularPriceAndPriceExpirationToWishlistGames1767638795894'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" ADD "regularPrice" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "games" ADD "priceExpiry" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "priceExpiry"`);
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "regularPrice"`);
    }

}
