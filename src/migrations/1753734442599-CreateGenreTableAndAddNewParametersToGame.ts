import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateGenreTableAndAddNewParametersToGame1753734442599 implements MigrationInterface {
    name = 'CreateGenreTableAndAddNewParametersToGame1753734442599'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "genres" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, CONSTRAINT "PK_80ecd718f0f00dde5d77a9be842" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "gamesGenres" ("gameId" uuid NOT NULL, "genreId" uuid NOT NULL, CONSTRAINT "PK_b3eea2f0d750b45f19fffc9c89d" PRIMARY KEY ("gameId", "genreId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8afa08845f687cc151a1ca0b28" ON "gamesGenres" ("gameId") `);
        await queryRunner.query(`CREATE INDEX "IDX_be2467ebab9045f94d332ca300" ON "gamesGenres" ("genreId") `);
        await queryRunner.query(`ALTER TABLE "games" ADD "releaseDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "games" ADD "developer" character varying`);
        await queryRunner.query(`ALTER TABLE "games" ADD "publisher" character varying`);
        await queryRunner.query(`ALTER TABLE "gamesGenres" ADD CONSTRAINT "FK_8afa08845f687cc151a1ca0b284" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "gamesGenres" ADD CONSTRAINT "FK_be2467ebab9045f94d332ca300b" FOREIGN KEY ("genreId") REFERENCES "genres"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gamesGenres" DROP CONSTRAINT "FK_be2467ebab9045f94d332ca300b"`);
        await queryRunner.query(`ALTER TABLE "gamesGenres" DROP CONSTRAINT "FK_8afa08845f687cc151a1ca0b284"`);
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "publisher"`);
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "developer"`);
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "releaseDate"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_be2467ebab9045f94d332ca300"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8afa08845f687cc151a1ca0b28"`);
        await queryRunner.query(`DROP TABLE "gamesGenres"`);
        await queryRunner.query(`DROP TABLE "genres"`);
    }

}
