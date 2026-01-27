import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OrmConnectionEnum } from "../../../shared/enum/orm-connection.enum";
import { ParticipanteFindByIdResponseMapper } from "../../contracts/mappers/participante/findById.mapper";
import { ParticipanteFindByIdResponseDto } from "../../domain/dtos/participante/findByIdResponse.dto";
import { Participante } from "../../domain/entities/participante.entity";

@Injectable()
export class ParticipanteService {
    constructor(@InjectRepository(Participante, OrmConnectionEnum.Gincana) private readonly participanteRepo: Repository<Participante>) {}

    async findByCpf(cpf: string) {
        let participante = await this.participanteRepo.findOneBy({ cpf: cpf });

        if (!participante) {
            return <ParticipanteFindByIdResponseDto>{};
        }

        return ParticipanteFindByIdResponseMapper(participante);
    }
}
