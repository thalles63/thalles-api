import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrmConnectionEnum } from "../../../shared/enum/orm-connection.enum";
import { InscricaoParticipante } from "../../domain/entities/inscricao-participante.entity";
import { Inscricao } from "../../domain/entities/inscricao.entity";
import { Participante } from "../../domain/entities/participante.entity";
import { PagamentoController } from "./pagamento.controller";
import { PagamentoService } from "./pagamento.service";
import { WhatsappService } from "./whatsapp.service";

@Module({
    imports: [TypeOrmModule.forFeature([Inscricao, Participante, InscricaoParticipante], OrmConnectionEnum.Gincana)],
    controllers: [PagamentoController],
    providers: [WhatsappService, PagamentoService]
})
export class PagamentoModule {}
