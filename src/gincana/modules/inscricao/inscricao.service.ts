import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import crypto from "crypto";
import { Repository } from "typeorm";
import { OrmConnectionEnum } from "../../../shared/enum/orm-connection.enum";
import { InscricaoFindByIdResponseMapper } from "../../contracts/mappers/inscricao/findById.mapper";
import { InscricaoFindByIdResponseDto } from "../../domain/dtos/inscricao/findByIdResponse.dto";
import { InscricaoSaveRequestDto } from "../../domain/dtos/inscricao/saveRequest.dto";
import { InscricaoParticipante } from "../../domain/entities/inscricao-participante.entity";
import { Inscricao } from "../../domain/entities/inscricao.entity";
import { Participante } from "../../domain/entities/participante.entity";
import { TipoParticipante } from "../../domain/enums/tipoParticipante.enum";
import { ValoresInscricao } from "../../domain/enums/valorInscricao.enum";
import { GincanaConfig } from "../../infrastructure/config/app.config";

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

    async validarQrcode(inscricaoId: string, token: string): Promise<any | null> {
        if (!token) return null;

        const expectedToken = crypto.createHmac("sha256", GincanaConfig.qrcodeHmacSecret).update(inscricaoId).digest("hex");

        const tokenBuffer = Buffer.from(token, "hex");
        const expectedBuffer = Buffer.from(expectedToken, "hex");

        if (tokenBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(tokenBuffer, expectedBuffer)) {
            return null;
        }

        const inscricao = await this.inscricaoRepo.findOne({
            where: { id: inscricaoId },
            relations: ["participantes", "participantes.participante"]
        });

        if (!inscricao) return null;

        const principal = inscricao.participantes.find((ip) => ip.tipo === TipoParticipante.Principal);

        return {
            id: inscricao.id,
            nome: principal?.participante?.nome ?? "",
            qtdParticipantes: inscricao.participantes.length,
            pago: !!inscricao.dataPagamento,
            dataPagamento: inscricao.dataPagamento,
            dataRetiradaCamiseta: inscricao.dataRetiradaCamiseta,
            participantes: inscricao.participantes.map((ip) => ({
                nome: ip.participante.nome,
                tamanhoCamiseta: ip.tamanhoCamiseta,
                tipo: ip.tipo
            }))
        };
    }

    async create(dto: InscricaoSaveRequestDto) {
        const inscricao = this.inscricaoRepo.create({ anoEdicao: dto.anoEdicao, ehPatrocinada: dto.ehPatrocinada, dataInscricao: new Date() });
        await this.inscricaoRepo.save(inscricao);

        for (const participante of dto.participantes) {
            let participanteSalvo = await this.participanteRepo.findOne({ where: { cpf: participante.cpf } });

            if (!participanteSalvo) {
                participanteSalvo = this.participanteRepo.create(participante);
            } else {
                Object.assign(participanteSalvo, participante);
            }
            await this.participanteRepo.save(participanteSalvo);

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

        if (idade > 10) {
            return ValoresInscricao.Adulto;
        }

        if (idade > 5) {
            return ValoresInscricao.Adolescente;
        }

        return ValoresInscricao.Crianca;
    }
}
