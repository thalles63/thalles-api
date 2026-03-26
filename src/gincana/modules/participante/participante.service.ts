import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OrmConnectionEnum } from "../../../shared/enum/orm-connection.enum";
import { ParticipanteFindByIdResponseMapper } from "../../contracts/mappers/participante/findById.mapper";
import { ParticipanteFindByIdResponseDto } from "../../domain/dtos/participante/findByIdResponse.dto";
import { ParticipanteStatusResponseDto } from "../../domain/dtos/participante/statusResponse.dto";
import { Participante } from "../../domain/entities/participante.entity";
import { ParticipanteStatus } from "../../domain/enums/participanteStatus.enum";

@Injectable()
export class ParticipanteService {
    constructor(@InjectRepository(Participante, OrmConnectionEnum.Gincana) private readonly participanteRepo: Repository<Participante>) {}

    async findByCpf(cpf: string) {
        let participante = await this.participanteRepo.findOneBy({ cpf: cpf });

        if (!participante) {
            return <ParticipanteFindByIdResponseDto>{};
        }

        return ParticipanteFindByIdResponseMapper(participante);
    }

    async findStatusByCpf(cpf: string): Promise<ParticipanteStatusResponseDto> {
        let participante = await this.participanteRepo.findOne({
            where: { cpf: cpf },
            relations: ["inscricoes", "inscricoes.inscricao"]
        });

        if (!participante || !participante.inscricoes || participante.inscricoes.length === 0) {
            return {
                status: ParticipanteStatus.EM_CADASTRAMENTO
            };
        }

        // Recupera a inscrição do ano atual mais recente (para não barrar na mesma pessoa se houver sujeira/testes)
        const anoAtual = new Date().getFullYear();
        const inscricao = participante.inscricoes
            .map(ip => ip.inscricao)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .find(i => i && i.anoEdicao === anoAtual);

        if (!inscricao) {
            return {
                status: ParticipanteStatus.EM_CADASTRAMENTO
            };
        }

        if (!inscricao.dataPagamento) {
            if (inscricao.idMercadoPago) {
                return {
                    status: ParticipanteStatus.AGUARDANDO_CONFIRMACAO_PAGAMENTO,
                    inscricaoId: inscricao.id
                };
            }
            return {
                status: ParticipanteStatus.AGUARDANDO_PAGAMENTO,
                inscricaoId: inscricao.id
            };
        }

        if (!inscricao.dataRetiradaCamiseta) {
            return {
                status: ParticipanteStatus.AGUARDANDO_RETIRADA_CAMISETA,
                inscricaoId: inscricao.id
            };
        }

        return {
            status: ParticipanteStatus.FINALIZADO,
            inscricaoId: inscricao.id
        };
    }
}
