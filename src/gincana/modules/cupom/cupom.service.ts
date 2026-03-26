import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OrmConnectionEnum } from "../../../shared/enum/orm-connection.enum";
import { Cupom } from "../../domain/entities/cupom.entity";
import { Inscricao } from "../../domain/entities/inscricao.entity";
import { Participante } from "../../domain/entities/participante.entity";

@Injectable()
export class CupomService {
    constructor(
        @InjectRepository(Cupom, OrmConnectionEnum.Gincana) private readonly cupomRepo: Repository<Cupom>,
        @InjectRepository(Inscricao, OrmConnectionEnum.Gincana) private readonly inscricaoRepo: Repository<Inscricao>,
        @InjectRepository(Participante, OrmConnectionEnum.Gincana) private readonly particRepo: Repository<Participante>
    ) {}

    async validate(codigo: string) {
        if (!codigo || codigo.trim() === "") {
            return { valido: false, message: "Código inválido." };
        }
        
        const cupom = await this.cupomRepo.findOne({ where: { codigo: codigo.trim() } });
        
        if (!cupom || !cupom.ativo) {
            return { valido: false, message: "Cupom inválido ou inativo." };
        }
        if (cupom.quantidadeUtilizada >= cupom.limiteUsos) {
            return { valido: false, message: "O limite de uso deste cupom já foi atingido." };
        }
        
        return { valido: true, usosRestantes: cupom.limiteUsos - cupom.quantidadeUtilizada };
    }
}
