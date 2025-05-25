import bcrypt from "bcryptjs";
import { Repository } from "typeorm";
import { appDataSource } from "../config/database.config";
import { User } from "../entities/user.entity";

export class UserService {
    private readonly userRepository: Repository<User>;

    constructor() {
        this.userRepository = appDataSource.getRepository(User);
    }

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.userRepository.findOneBy({ email });
        if (!user) return null;
        const valid = await bcrypt.compare(password, user.password);
        return valid ? user : null;
    }
}
