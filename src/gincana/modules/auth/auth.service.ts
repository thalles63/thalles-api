import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OAuth2Client } from "google-auth-library";
import * as jwt from "jsonwebtoken";
import { Repository } from "typeorm";
import { OrmConnectionEnum } from "../../../shared/enum/orm-connection.enum";
import { Admin } from "../../domain/entities/admin.entity";
import { FinanceiroConfig } from "../../../financeiro/infrastructure/config/app.config"; // Using the same clientId per request

@Injectable()
export class AuthService {
    private googleClient: OAuth2Client;

    constructor(
        @InjectRepository(Admin, OrmConnectionEnum.Gincana)
        private adminRepository: Repository<Admin>
    ) {
        this.googleClient = new OAuth2Client(FinanceiroConfig.google.clientId);
    }

    async googleLogin(token: string) {
        try {
            const ticket = await this.googleClient.verifyIdToken({
                idToken: token,
                audience: FinanceiroConfig.google.clientId
            });

            const payload = ticket.getPayload();
            if (!payload || !payload.email) {
                throw new UnauthorizedException("Token Google Inválido");
            }

            const { email, name, picture } = payload;

            const admin = await this.adminRepository.findOne({ where: { email } });

            if (!admin) {
                // If not in the admin table, deny access
                throw new UnauthorizedException("Usuário não autorizado. Este email não é administrador.");
            }

            // Sync user details if needed
            if (admin.name !== name || admin.picture !== picture) {
                admin.name = name ?? admin.name;
                admin.picture = picture ?? admin.picture;
                await this.adminRepository.save(admin);
            }

            // Generate JWT for inner API usage
            const jwtPayload = { sub: admin.id, email: admin.email, name: admin.name, role: admin.role };
            const accessToken = jwt.sign(jwtPayload, process.env.JWT_SECRET || "default_gincana_secret", { expiresIn: "1y" });

            return {
                accessToken,
                user: {
                    id: admin.id,
                    email: admin.email,
                    name: admin.name,
                    picture: admin.picture,
                    role: admin.role
                }
            };
        } catch (error) {
            console.error("Google Login Error:", error);
            throw new UnauthorizedException("Token Google inválido ou expirado.");
        }
    }
}
