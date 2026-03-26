import { ParticipanteStatus } from "../../enums/participanteStatus.enum";

export class ParticipanteStatusResponseDto {
    status: ParticipanteStatus;
    inscricaoId?: string;
}
