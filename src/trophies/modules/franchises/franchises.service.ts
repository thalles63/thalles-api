import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OrmConnectionEnum } from "../../../shared/enum/orm-connection.enum";
import { Franchise } from "../../domain/entities/franchise.entity";

@Injectable()
export class FranchisesService {
    constructor(
        @InjectRepository(Franchise, OrmConnectionEnum.Trophies)
        private readonly franchiseRepository: Repository<Franchise>
    ) {}

    public async list() {
        return this.franchiseRepository.find({ order: { name: "ASC" } });
    }

    public async create(name: string) {
        if (!name?.trim()) {
            throw new BadRequestException("Franchise name is required");
        }
        const franchise = this.franchiseRepository.create({ name: name.trim() });
        return this.franchiseRepository.save(franchise);
    }

    public async findById(id: string) {
        return this.franchiseRepository.findOne({ where: { id }, relations: ["games"] });
    }
}
