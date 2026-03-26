import { ParticipanteFindByIdResponseDto } from "../../../domain/dtos/participante/findByIdResponse.dto";
import { Inscricao } from "../../../domain/entities/inscricao.entity";
import { Participante } from "../../../domain/entities/participante.entity";
import { ObterValoresPorDataNascimento } from "../inscricao/findById.mapper";

export const ParticipanteFindByIdResponseMapper = (participante: Participante, inscricao?: Inscricao): ParticipanteFindByIdResponseDto => {
    return {
        cpf: participante.cpf,
        dataNascimento: participante.dataNascimento,
        email: participante.email,
        nome: participante.nome,
        telefone: participante.telefone,
        tamanhoCamiseta: inscricao ? inscricao.participantes.find((p) => p.participanteId === participante.cpf)?.tamanhoCamiseta! : undefined,
        valor: inscricao ? ObterValoresPorDataNascimento(participante.dataNascimento).cartao : undefined,
        valorPix: inscricao ? ObterValoresPorDataNascimento(participante.dataNascimento).pix : undefined
    };
};
