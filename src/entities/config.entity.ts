import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("configs")
export class Config {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    key: string;

    @Column()
    value: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
