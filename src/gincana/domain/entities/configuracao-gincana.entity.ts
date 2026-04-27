import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("configuracao_gincana")
export class ConfiguracaoGincana {
    @PrimaryColumn()
    id: number;

    @Column({ default: false })
    inscricoesEncerradas: boolean;
}
