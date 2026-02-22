import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("split_expense_months")
export class SplitExpenseMonth {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    month: number;

    @Column()
    year: number;

    @Column({ default: false })
    isClosed: boolean;

    @Column({ nullable: true })
    closedByUserId: string;

    @Column({ nullable: true })
    closedAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
