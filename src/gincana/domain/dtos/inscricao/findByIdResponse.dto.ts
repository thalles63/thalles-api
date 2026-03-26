import { ParticipanteFindByIdResponseDto } from "../participante/findByIdResponse.dto";

export interface InscricaoFindByIdResponseDto {
    id: string;
    dataInscricao: Date;
    dataPagamento: Date;
    dataRetiradaCamiseta: Date;
    ehPatrocinada: boolean;
    anoEdicao: number;
    valor: number;
    valorPix: number;
    participantePrincipal: ParticipanteFindByIdResponseDto;
    outrosParticipantes: ParticipanteFindByIdResponseDto[];
}
