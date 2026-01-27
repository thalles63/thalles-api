import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrmConnectionEnum } from "../../../shared/enum/orm-connection.enum";
import { InscricaoParticipante } from "../../domain/entities/inscricao-participante.entity";
import { Inscricao } from "../../domain/entities/inscricao.entity";
import { Participante } from "../../domain/entities/participante.entity";
import { InscricaoController } from "./inscricao.controller";
import { InscricaoService } from "./inscricao.service";

@Module({
    imports: [TypeOrmModule.forFeature([Inscricao, Participante, InscricaoParticipante], OrmConnectionEnum.Gincana)],
    controllers: [InscricaoController],
    providers: [InscricaoService]
})
export class InscricaoModule {}
