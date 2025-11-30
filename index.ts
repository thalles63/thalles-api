import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./src/app.module";
import { config } from "./src/infrastructure/config/app.config";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true
        })
    );

    await app.listen(config.server.port);
    console.log("API rodando na porta" + config.server.port);
}

bootstrap();
