import server from "./src/app";
import { config } from "./src/config/app.config";
import logger from "./src/utils/logger/logger";

const PORT = config.server.port;

server.listen(PORT, () => {
    if (config.server.env === "PRD") {
        logger.info(`Server running at http://localhost:${PORT}`);
        logger.info(`Environment: ${config.server.env}`);
    }
});
