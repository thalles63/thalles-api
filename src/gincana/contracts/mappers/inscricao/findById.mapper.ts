import { InscricaoFindByIdResponseDto } from "../../../domain/dtos/inscricao/findByIdResponse.dto";
import { Inscricao } from "../../../domain/entities/inscricao.entity";
import { Participante } from "../../../domain/entities/participante.entity";
import { TipoParticipante } from "../../../domain/enums/tipoParticipante.enum";
import { ParticipanteFindByIdResponseMapper } from "../participante/findById.mapper";

export const InscricaoFindByIdResponseMapper = (inscricao: Inscricao): InscricaoFindByIdResponseDto => {
    const participantePrincipal = inscricao.participantes.find((p) => p.tipo === TipoParticipante.Principal)?.participante ?? <Participante>{};
    const outrosParticipantes = inscricao.participantes.filter((p) => p.tipo === TipoParticipante.Familiar).map((p) => p.participante);

    return {
        id: inscricao.id,
        dataInscricao: inscricao.dataInscricao,
        dataPagamento: inscricao.dataPagamento,
        dataRetiradaCamiseta: inscricao.dataRetiradaCamiseta,
        ehPatrocinada: inscricao.ehPatrocinada,
        anoEdicao: inscricao.anoEdicao,
        valor: CalculaValorParticipantes(inscricao),
        participantePrincipal: ParticipanteFindByIdResponseMapper(participantePrincipal, inscricao),
        outrosParticipantes: outrosParticipantes.map((p) => ParticipanteFindByIdResponseMapper(p, inscricao))
    };
};

export const CalculaValorParticipantes = (inscricao: Inscricao) => {
    return inscricao.participantes.reduce((total, item) => total + item.valor, 0);
};
