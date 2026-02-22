import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrmConnectionEnum } from "../../../shared/enum/orm-connection.enum";
import { User } from "../../domain/entities/user.entity";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
    imports: [TypeOrmModule.forFeature([User], OrmConnectionEnum.Financeiro)],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}
