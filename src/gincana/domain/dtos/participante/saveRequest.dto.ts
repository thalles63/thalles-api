import { TipoParticipante } from "../../enums/tipoParticipante.enum";

export interface ParticipantSaveRequestDto {
    cpf: string;
    dataNascimento: Date;
    email: string;
    nome: string;
    telefone: string;
    tamanhoCamiseta: number;
    tipo: TipoParticipante;
}
