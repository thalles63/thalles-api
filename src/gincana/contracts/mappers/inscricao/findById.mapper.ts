import { InscricaoFindByIdResponseDto } from "../../../domain/dtos/inscricao/findByIdResponse.dto";
import { Inscricao } from "../../../domain/entities/inscricao.entity";
import { Participante } from "../../../domain/entities/participante.entity";
import { TipoParticipante } from "../../../domain/enums/tipoParticipante.enum";
import { ValoresInscricao } from "../../../domain/enums/valorInscricao.enum";
import { ParticipanteFindByIdResponseMapper } from "../participante/findById.mapper";

export const InscricaoFindByIdResponseMapper = (inscricao: Inscricao): InscricaoFindByIdResponseDto => {
    const participantePrincipal = inscricao.participantes.find((p) => p.tipo === TipoParticipante.Principal)?.participante ?? <Participante>{};
    const outrosParticipantes = inscricao.participantes.filter((p) => p.tipo === TipoParticipante.Familiar).map((p) => p.participante);

    const valorTotal = CalculaValorCartaoParticipantes(inscricao);
    const valorPix = CalculaValorPixParticipantes(inscricao);

    return {
        id: inscricao.id,
        dataInscricao: inscricao.dataInscricao,
        dataPagamento: inscricao.dataPagamento,
        dataRetiradaCamiseta: inscricao.dataRetiradaCamiseta,
        ehPatrocinada: inscricao.ehPatrocinada,
        anoEdicao: inscricao.anoEdicao,
        valor: valorTotal,
        valorPix: valorPix,
        participantePrincipal: ParticipanteFindByIdResponseMapper(participantePrincipal, inscricao),
        outrosParticipantes: outrosParticipantes.map((p) => ParticipanteFindByIdResponseMapper(p, inscricao))
    };
};

export function ObterValoresPorDataNascimento(dataNascimentoString: Date | string) {
    const hoje = new Date();
    const dataNascimento = new Date(dataNascimentoString);
    let idade = hoje.getFullYear() - dataNascimento.getFullYear();
    const diferencaDeMeses = hoje.getMonth() - dataNascimento.getMonth();

    if (diferencaDeMeses < 0 || (diferencaDeMeses === 0 && hoje.getDate() < dataNascimento.getDate())) {
        idade--;
    }

    if (idade > 12) return ValoresInscricao.Adulto;
    if (idade > 5) return ValoresInscricao.Adolescente;
    return ValoresInscricao.Crianca;
}

export function CalculaValorPixParticipantes(inscricao: Inscricao) {
    return inscricao.participantes.reduce((total, item) => {
        const preco = ObterValoresPorDataNascimento(item.participante.dataNascimento);
        return total + preco.pix;
    }, 0);
}

export function CalculaValorCartaoParticipantes(inscricao: Inscricao) {
    return inscricao.participantes.reduce((total, item) => {
        const preco = ObterValoresPorDataNascimento(item.participante.dataNascimento);
        return total + preco.cartao;
    }, 0);
}
