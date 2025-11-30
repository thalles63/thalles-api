import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import bcrypt from "bcryptjs";
import { Repository } from "typeorm";
import { LoginCredentialsDto } from "../../domain/dtos/login-credentials.dto";
import { User } from "../../domain/entities/user.entity";

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

    public async validateUser(loginCredentials: LoginCredentialsDto) {
        const user = await this.userRepository.findOneBy({ email: loginCredentials.email });

        if (!user) {
            return null;
        }

        const valid = await bcrypt.compare(loginCredentials.password, user.password);

        return valid ? user : null;
    }
}
