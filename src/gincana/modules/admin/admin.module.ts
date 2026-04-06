import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrmConnectionEnum } from "../../../shared/enum/orm-connection.enum";
import { Inscricao } from "../../domain/entities/inscricao.entity";
import { WhatsappService } from "../pagamento/whatsapp.service";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";

@Module({
    imports: [TypeOrmModule.forFeature([Inscricao], OrmConnectionEnum.Gincana)],
    controllers: [AdminController],
    providers: [AdminService, WhatsappService]
})
export class AdminModule {}
