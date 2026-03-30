import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDTO } from "./dtos/login.dto";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("google")
    async googleLogin(@Body() payload: LoginDTO) {
        return this.authService.googleLogin(payload.token);
    }
}
