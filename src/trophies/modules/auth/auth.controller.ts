import { Body, Controller, ForbiddenException, Post } from "@nestjs/common";
import jwt from "jsonwebtoken";
import { LoginCredentialsDto } from "../../domain/dtos/login-credentials.dto";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    private readonly JWT_SECRET = process.env.JWT_SECRET!;

    @Post("login")
    async findByCpf(@Body() loginCredentials: LoginCredentialsDto) {
        const user = await this.authService.validateUser(loginCredentials);

        if (!user) {
            throw new ForbiddenException(`Invalid credentials`);
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, this.JWT_SECRET, { expiresIn: "7d" });

        return { token };
    }
}
