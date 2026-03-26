import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OrmConnectionEnum } from "../../../shared/enum/orm-connection.enum";
import { InscricaoFindByIdResponseMapper } from "../../contracts/mappers/inscricao/findById.mapper";
import { InscricaoFindByIdResponseDto } from "../../domain/dtos/inscricao/findByIdResponse.dto";
import { InscricaoSaveRequestDto } from "../../domain/dtos/inscricao/saveRequest.dto";
import { InscricaoParticipante } from "../../domain/entities/inscricao-participante.entity";
import { Inscricao } from "../../domain/entities/inscricao.entity";
import { Participante } from "../../domain/entities/participante.entity";
import { ValoresInscricao } from "../../domain/enums/valorInscricao.enum";

@Injectable()
export class InscricaoService {
    constructor(
        @InjectRepository(Inscricao, OrmConnectionEnum.Gincana) private readonly inscricaoRepo: Repository<Inscricao>,
        @InjectRepository(Participante, OrmConnectionEnum.Gincana) private readonly participanteRepo: Repository<Participante>,
        @InjectRepository(InscricaoParticipante, OrmConnectionEnum.Gincana) private readonly ipRepo: Repository<InscricaoParticipante>
    ) {}

    async findByCpf(cpf: string) {
        let inscricao = await this.inscricaoRepo
            .createQueryBuilder("inscricao")
            .leftJoinAndSelect("inscricao.participantes", "ip")
            .leftJoinAndSelect("ip.participante", "p")
            .where((qb) => {
                const subQuery = qb
                    .subQuery()
                    .select("1")
                    .from("inscricao_participante", "ip2")
                    .innerJoin("participantes", "p2", "ip2.participanteId = p2.cpf")
                    .where("ip2.inscricaoId = inscricao.id")
                    .andWhere("p2.cpf = :cpf")
                    .getQuery();
                return `EXISTS ${subQuery}`;
            })
            .andWhere("inscricao.anoEdicao = :ano")
            .setParameter("cpf", cpf)
            .setParameter("ano", new Date().getFullYear())
            .getOne();

        if (!inscricao) {
            return <InscricaoFindByIdResponseDto>{};
        }

        return InscricaoFindByIdResponseMapper(inscricao);
    }

    async findById(id: string) {
        const inscricao = await this.inscricaoRepo.findOne({
            where: { id },
            relations: ["participantes", "participantes.participante"]
        });

        if (!inscricao) {
            return <InscricaoFindByIdResponseDto>{};
        }

        return InscricaoFindByIdResponseMapper(inscricao);
    }

    async create(dto: InscricaoSaveRequestDto) {
        const inscricao = this.inscricaoRepo.create({ anoEdicao: dto.anoEdicao, ehPatrocinada: dto.ehPatrocinada, dataInscricao: new Date() });
        await this.inscricaoRepo.save(inscricao);

        for (const participante of dto.participantes) {
            let participanteSalvo = await this.participanteRepo.findOne({ where: { cpf: participante.cpf } });

            if (!participanteSalvo) {
                participanteSalvo = this.participanteRepo.create(participante);
                await this.participanteRepo.save(participanteSalvo);
            }

            const precos = this.calculaValorDoParticipante(participanteSalvo);

            const ip = this.ipRepo.create({
                inscricaoId: inscricao.id,
                participanteId: participanteSalvo.cpf,
                tipo: participante.tipo,
                valor: precos.cartao,
                tamanhoCamiseta: participante.tamanhoCamiseta
            });

            await this.ipRepo.save(ip);
        }

        return await this.inscricaoRepo.findOne({
            where: { id: inscricao.id },
            relations: ["participantes", "participantes.participante"]
        });
    }

    private calculaValorDoParticipante(participante: Participante) {
        const hoje = new Date();
        const dataNascimento = new Date(participante.dataNascimento);
        let idade = hoje.getFullYear() - dataNascimento.getFullYear();
        const diferencaDeMeses = hoje.getMonth() - dataNascimento.getMonth();

        if (diferencaDeMeses < 0 || (diferencaDeMeses === 0 && hoje.getDate() < dataNascimento.getDate())) {
            idade--;
        }

        if (idade > 12) {
            return ValoresInscricao.Adulto;
        }

        if (idade > 5) {
            return ValoresInscricao.Adolescente;
        }

        return ValoresInscricao.Crianca;
    }
}
