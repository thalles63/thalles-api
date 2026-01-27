import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import type { InscricaoParticipante } from "./inscricao-participante.entity";

@Entity("inscricao")
export class Inscricao {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: true })
    dataInscricao: Date;

    @Column({ nullable: true })
    dataPagamento: Date;

    @Column({ nullable: true })
    dataRetiradaCamiseta: Date;

    @Column({ default: false })
    ehPatrocinada: boolean;

    @Column({ nullable: true })
    idMercadoPago: string;

    @Column()
    anoEdicao: number;

    @OneToMany(
        () => (require("./inscricao-participante.entity") as typeof import("./inscricao-participante.entity")).InscricaoParticipante,
        (ip) => ip.inscricao,
        { cascade: true }
    )
    participantes: InscricaoParticipante[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
