import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TipoParticipante } from "../enums/tipoParticipante.enum";
import type { Inscricao } from "./inscricao.entity";
import type { Participante } from "./participante.entity";

@Entity("inscricao_participante")
export class InscricaoParticipante {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "enum", enum: [TipoParticipante.Principal, TipoParticipante.Familiar] })
    tipo: TipoParticipante;

    @Column()
    participanteId: string;

    @Column()
    inscricaoId: string;

    @Column({ type: "decimal", precision: 10, scale: 2, transformer: { to: (v: number) => v, from: (v: string) => parseFloat(v) } })
    valor: number;

    @Column()
    tamanhoCamiseta: number;

    @ManyToOne(() => (require("./participante.entity") as typeof import("./participante.entity")).Participante, (p) => p.inscricoes, { onDelete: "CASCADE" })
    @JoinColumn({ name: "participanteId" })
    participante: Participante;

    @ManyToOne(() => (require("./inscricao.entity") as typeof import("./inscricao.entity")).Inscricao, (i) => i.participantes, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "inscricaoId" })
    inscricao: Inscricao;
}
