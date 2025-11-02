import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import bcrypt from "bcryptjs";
import { Repository } from "typeorm";
import { User } from "../../domain/entities/user.entity";
import type { LoginCredentials } from "../../domain/interfaces/login-credentials.interface";

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

    public async validateUser(loginCredentials: LoginCredentials) {
        const user = await this.userRepository.findOneBy({ email: loginCredentials.email });

        if (!user) {
            return null;
        }

        const valid = await bcrypt.compare(loginCredentials.password, user.password);

        return valid ? user : null;
    }
}
