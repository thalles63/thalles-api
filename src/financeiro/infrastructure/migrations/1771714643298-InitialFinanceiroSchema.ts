import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialFinanceiroSchema1771714643298 implements MigrationInterface {
    name = 'InitialFinanceiroSchema1771714643298'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "name" character varying NOT NULL, "picture" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ba9ef7bb6ada10fb97c3c4f58e3" UNIQUE ("email"), CONSTRAINT "PK_f38e26894514aba89d840e9d498" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "split_expenses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, "totalValue" numeric(10,2) NOT NULL, "date" character varying NOT NULL, "payerId" character varying NOT NULL, "participantId" character varying NOT NULL, "actionCode" character varying NOT NULL, "categoryId" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c47f964b9c4a5e95fcd3f4847c2" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "split_expenses"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
