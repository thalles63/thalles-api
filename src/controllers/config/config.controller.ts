import { Request, Response } from "express";
import { ConfigService } from "../../services/config.service";

export class ConfigController {
    private readonly configService: ConfigService;

    constructor() {
        this.configService = new ConfigService();
    }

    async save(req: Request, res: Response): Promise<void> {
        const { configs } = req.body;

        await this.configService.save(configs);

        res.json({ config: true });
    }
}
