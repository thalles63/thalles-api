import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OrmConnectionEnum } from "../../../shared/enum/orm-connection.enum";
import { Inscricao } from "../../domain/entities/inscricao.entity";
import { TipoParticipante } from "../../domain/enums/tipoParticipante.enum";

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Inscricao, OrmConnectionEnum.Gincana) private readonly inscricaoRepo: Repository<Inscricao>
    ) {}

    async listarInscricoes(anoEdicao?: number, page: number = 1, pageSize: number = 20, statusPagamento?: string) {
        const query = this.inscricaoRepo
            .createQueryBuilder("inscricao")
            .leftJoinAndSelect("inscricao.participantes", "ip")
            .leftJoinAndSelect("ip.participante", "p")
            .orderBy("inscricao.createdAt", "DESC");

        if (anoEdicao) {
            query.andWhere("inscricao.anoEdicao = :anoEdicao", { anoEdicao });
        }

        if (statusPagamento === "pago") {
            query.andWhere("inscricao.dataPagamento IS NOT NULL");
        } else if (statusPagamento === "pendente") {
            query.andWhere("inscricao.dataPagamento IS NULL");
        }

        const allInscricoes = await query.getMany();
        const total = allInscricoes.length;

        const mapped = allInscricoes.map(inscricao => {
            const principal = inscricao.participantes.find(p => p.tipo === TipoParticipante.Principal);
            const valorTotal = inscricao.participantes.reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);
            const quantidadeParticipantes = inscricao.participantes.length;
            return {
                id: inscricao.id,
                anoEdicao: inscricao.anoEdicao,
                dataInscricao: inscricao.dataInscricao,
                dataPagamento: inscricao.dataPagamento,
                dataRetiradaCamiseta: inscricao.dataRetiradaCamiseta,
                ehPatrocinada: inscricao.ehPatrocinada,
                pago: !!inscricao.dataPagamento,
                quantidadeParticipantes,
                participantePrincipalNome: principal?.participante?.nome ?? "Desconhecido",
                participantePrincipalTelefone: principal?.participante?.telefone ?? "",
                valorTotal,
                valorTotalPix: valorTotal - (quantidadeParticipantes * 5)
            };
        });

        const sumVagas = mapped.reduce((acc, curr) => acc + curr.quantidadeParticipantes, 0);
        const sumValorPix = mapped.reduce((acc, curr) => acc + (curr.ehPatrocinada ? 0 : curr.valorTotalPix), 0);

        const start = (page - 1) * pageSize;
        const data = mapped.slice(start, start + pageSize);

        return { data, total, page, pageSize, sumVagas, sumValorPix };
    }

    async confirmarRetirada(id: string) {
        const inscricao = await this.inscricaoRepo.findOne({ where: { id } });
        if (!inscricao) {
            throw new NotFoundException("Inscrição não encontrada.");
        }

        if (inscricao.dataRetiradaCamiseta) {
            return { error: true, message: "Camiseta já foi retirada anteriormente.", dataRetiradaCamiseta: inscricao.dataRetiradaCamiseta };
        }

        inscricao.dataRetiradaCamiseta = new Date();
        await this.inscricaoRepo.save(inscricao);

        return { message: "Retirada confirmada com sucesso.", dataRetiradaCamiseta: inscricao.dataRetiradaCamiseta };
    }
}
