import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import type { InscricaoParticipante } from "./inscricao-participante.entity";

@Entity("participantes")
export class Participante {
    @PrimaryColumn()
    cpf: string;

    @Column()
    dataNascimento: Date;

    @Column({ nullable: true })
    email?: string;

    @Column()
    nome: string;

    @Column()
    telefone: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ nullable: true })
    inscricaoId?: string;

    @OneToMany(
        () => (require("./inscricao-participante.entity") as typeof import("./inscricao-participante.entity")).InscricaoParticipante,
        (ip) => ip.participante
    )
    inscricoes: InscricaoParticipante[];
}
