import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import helmet from "helmet";
import { AppModule } from "./src/app.module";
import { FinanceiroConfig } from "./src/financeiro/infrastructure/config/app.config";
import { GincanaConfig } from "./src/gincana/infrastructure/config/app.config";
import { GeneralConfig } from "./src/shared/config/general.config";
import { TrophiesConfig } from "./src/trophies/infrastructure/config/app.config";

const allowedOrigins = [GincanaConfig.frontend_url, FinanceiroConfig.frontend_url, TrophiesConfig.frontend_url];

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(helmet());
    app.use((_req: any, res: any, next: any) => {
        res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=(), fullscreen=(self)");
        next();
    });
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error(`Origin ${origin} not allowed by CORS`));
            }
        },
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    });

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true
        })
    );

    await app.listen(GeneralConfig.port, "0.0.0.0");
    console.log("API rodando na porta" + GeneralConfig.port);
}

bootstrap();
