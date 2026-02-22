import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDTO } from "./dtos/login.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("google")
    async googleLogin(@Body() payload: LoginDTO) {
        return this.authService.googleLogin(payload.token);
    }

    @UseGuards(JwtAuthGuard)
    @Get("partner")
    async getPartner(@Request() req: any) {
        // req.user contains the decoded JWT (which has sub property as user id)
        const userId = req.user.sub;
        return this.authService.getPartner(userId);
    }
}
