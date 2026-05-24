import { Controller, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../infrastructure/guards/auth.guard";
import { MigrationService } from "./migration.service";

@Controller("admin")
export class MigrationController {
    constructor(private readonly migrationService: MigrationService) {}

    @Post("migrate-images")
    @UseGuards(AuthGuard)
    migrateImages() {
        this.migrationService.migrateAllImages();
        return { status: "started", message: "Migração iniciada. Acompanhe o terminal e consulte migration-report.json ao final." };
    }
}
