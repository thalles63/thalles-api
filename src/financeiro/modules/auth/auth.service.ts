import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OAuth2Client } from "google-auth-library";
import * as jwt from "jsonwebtoken";
import { Repository } from "typeorm";
import { OrmConnectionEnum } from "../../../shared/enum/orm-connection.enum";
import { User } from "../../domain/entities/user.entity";
import { FinanceiroConfig } from "../../infrastructure/config/app.config";

@Injectable()
export class AuthService {
    private googleClient: OAuth2Client;

    constructor(
        @InjectRepository(User, OrmConnectionEnum.Financeiro)
        private userRepository: Repository<User>
    ) {
        this.googleClient = new OAuth2Client(FinanceiroConfig.google.clientId);
    }

    async googleLogin(token: string) {
        try {
            const ticket = await this.googleClient.verifyIdToken({
                idToken: token,
                audience: FinanceiroConfig.google.clientId,
            });

            const payload = ticket.getPayload();
            if (!payload || !payload.email) {
                throw new UnauthorizedException("Invalid Google Token");
            }

            const { email, name, picture } = payload;

            const user = await this.userRepository.findOne({ where: { email } });

            if (!user) {
                // No registration allowed, reject login
                throw new UnauthorizedException("User not authorized. Please contact the administrator to grant access.");
            }

            // Sync user details if needed (optional)
            if (user.name !== name || user.picture !== picture) {
                user.name = name ?? user.name;
                user.picture = picture ?? user.picture;
                await this.userRepository.save(user);
            }

            // Generate JWT for inner API usage
            const jwtPayload = { sub: user.id, email: user.email, name: user.name };
            const accessToken = jwt.sign(jwtPayload, process.env.JWT_SECRET || "default_secret", { expiresIn: "1y" });

            return {
                accessToken,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    picture: user.picture
                }
            };

        } catch (error) {
            console.error("Google Login Error:", error);
            throw new UnauthorizedException("Invalid or expired Google token");
        }
    }

    async getPartner(currentUserId: string): Promise<User> {
        // Fetch the other user from the database who is not the current user
        // Used specifically because there are only 2 users in the database
        const partner = await this.userRepository
            .createQueryBuilder("user")
            .where("user.id != :id", { id: currentUserId })
            .getOne();

        if (!partner) {
            throw new UnauthorizedException("Partner not found");
        }

        return partner;
    }
}
