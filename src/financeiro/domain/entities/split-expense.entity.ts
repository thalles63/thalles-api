import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("split_expenses")
export class SplitExpense {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    description: string;

    @Column("decimal", { precision: 10, scale: 2 })
    totalValue: number;

    @Column()
    date: string; // Sticking to ISO format string per the DTO request.

    @Column()
    payerId: string;

    @Column()
    participantId: string;

    @Column()
    actionCode: string; // e.g., 'SPLIT_50', 'CHARGE_100'

    @Column({ nullable: true })
    categoryId?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
