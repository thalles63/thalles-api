import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("cupons")
export class Cupom {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    codigo: string;

    @Column()
    limiteUsos: number;

    @Column({ default: 0 })
    quantidadeUtilizada: number;

    @Column({ default: true })
    ativo: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
