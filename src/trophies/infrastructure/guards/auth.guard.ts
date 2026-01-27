import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import jwt from "jsonwebtoken";

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest();
        const authHeader = req.headers["authorization"];

        if (!authHeader) {
            throw new UnauthorizedException("No Token Provided");
        }

        const token = authHeader.split(" ")[1];
        try {
            jwt.verify(token, process.env.JWT_SECRET!);

            return true;
        } catch {
            throw new UnauthorizedException("Invalid toekn");
        }
    }
}
