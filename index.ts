import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./src/app.module";
import { GeneralConfig } from "./src/shared/config/general.config";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();

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
