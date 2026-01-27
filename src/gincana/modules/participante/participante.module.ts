import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrmConnectionEnum } from "../../../shared/enum/orm-connection.enum";
import { Participante } from "../../domain/entities/participante.entity";
import { ParticipanteController } from "./participante.controller";
import { ParticipanteService } from "./participante.service";

@Module({
    imports: [TypeOrmModule.forFeature([Participante], OrmConnectionEnum.Gincana)],
    controllers: [ParticipanteController],
    providers: [ParticipanteService]
})
export class ParticipanteModule {}
