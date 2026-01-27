import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import bcrypt from "bcryptjs";
import { Repository } from "typeorm";
import { OrmConnectionEnum } from "../../../shared/enum/orm-connection.enum";
import { LoginCredentialsDto } from "../../domain/dtos/login-credentials.dto";
import { User } from "../../domain/entities/user.entity";

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User, OrmConnectionEnum.Trophies) private readonly userRepository: Repository<User>) {}

    public async validateUser(loginCredentials: LoginCredentialsDto) {
        const user = await this.userRepository.findOneBy({ email: loginCredentials.email });

        if (!user) {
            return null;
        }

        const valid = await bcrypt.compare(loginCredentials.password, user.password);

        return valid ? user : null;
    }
}
