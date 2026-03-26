import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrmConnectionEnum } from "../../../shared/enum/orm-connection.enum";
import { Cupom } from "../../domain/entities/cupom.entity";
import { Inscricao } from "../../domain/entities/inscricao.entity";
import { Participante } from "../../domain/entities/participante.entity";
import { CupomController } from "./cupom.controller";
import { CupomService } from "./cupom.service";

@Module({
    imports: [TypeOrmModule.forFeature([Cupom, Inscricao, Participante], OrmConnectionEnum.Gincana)],
    controllers: [CupomController],
    providers: [CupomService]
})
export class CupomModule {}
