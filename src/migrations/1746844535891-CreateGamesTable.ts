import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateGamesTable1746844535891 implements MigrationInterface {
    name = 'CreateGamesTable1746844535891'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "games" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "image" character varying NOT NULL, "platform" integer NOT NULL, "timePlayed" integer NOT NULL DEFAULT '0', "isPlatinumed" boolean NOT NULL DEFAULT false, "dateCompleted" TIMESTAMP, "isCampaignComplete" boolean NOT NULL DEFAULT false, "rating" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c9b16b62917b5595af982d66337" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "games"`);
    }

}
