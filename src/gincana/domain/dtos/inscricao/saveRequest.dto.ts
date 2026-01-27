import { ParticipantSaveRequestDto } from "../participante/saveRequest.dto";

export interface InscricaoSaveRequestDto {
    ehPatrocinada: boolean;
    anoEdicao: number;
    participantes: ParticipantSaveRequestDto[];
}
