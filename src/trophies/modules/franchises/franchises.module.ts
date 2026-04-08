import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrmConnectionEnum } from "../../../shared/enum/orm-connection.enum";
import { Franchise } from "../../domain/entities/franchise.entity";
import { FranchisesController } from "./franchises.controller";
import { FranchisesService } from "./franchises.service";

@Module({
    imports: [TypeOrmModule.forFeature([Franchise], OrmConnectionEnum.Trophies)],
    controllers: [FranchisesController],
    providers: [FranchisesService]
})
export class FranchisesModule {}
