import { Repository } from "typeorm";
import { appDataSource } from "../config/database.config";
import { Config } from "../entities/config.entity";

export class ConfigService {
    private readonly configRepository: Repository<Config>;

    constructor() {
        this.configRepository = appDataSource.getRepository(Config);
    }

    async save(configs: Config[]): Promise<null> {
        for (let config of configs) {
            const configuration = await this.configRepository.findOneBy({ key: config.key });

            if (!configuration) {
                continue;
            }

            const newConfig = this.configRepository.create({
                value: config.value
            });

            Object.assign(configuration, newConfig);
            await this.configRepository.save(configuration);
        }

        return null;
    }
}
