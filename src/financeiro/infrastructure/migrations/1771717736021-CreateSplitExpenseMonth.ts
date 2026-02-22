import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSplitExpenseMonth1771717736021 implements MigrationInterface {
    name = 'CreateSplitExpenseMonth1771717736021'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "split_expense_months" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "month" integer NOT NULL, "year" integer NOT NULL, "isClosed" boolean NOT NULL DEFAULT false, "closedByUserId" character varying, "closedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c80c14193e197e9fcef843a1311" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "split_expense_months"`);
    }

}
