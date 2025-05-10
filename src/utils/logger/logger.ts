import { Logtail } from "@logtail/node";

const logQueue: Array<() => Promise<void>> = [];
let isProcessing = false;

const processQueue = async () => {
    if (isProcessing || logQueue.length === 0) return;

    isProcessing = true;
    while (logQueue.length > 0) {
        const logFn = logQueue.shift();
        if (logFn) {
            try {
                await logFn();
            } catch (err) {
                console.error("Failed to process log:", err);
            }
        }
    }
    isProcessing = false;
};

const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN || "", {
    endpoint: process.env.LOGTAIL_ENDPOINT
});

const queueLog = (level: string, message: string, data?: object) => {
    const logFn = async () => {
        try {
            switch (level) {
                case "info":
                    await logtail.info(message, data);
                    break;
                case "error":
                    await logtail.error(message, data);
                    break;
                case "warn":
                    await logtail.warn(message, data);
                    break;
                case "debug":
                    await logtail.debug(message, data);
                    break;
            }
        } catch (err) {
            console.error(`Logtail ${level} error:`, err);
        }
    };

    logQueue.push(logFn);
    processQueue();
};

export const logger = {
    info: (message: string, data?: object) => {
        queueLog("info", message, data);
    },
    error: (error: Error | string, data?: object) => {
        queueLog("error", error instanceof Error ? error.message : error, data);
    },
    warn: (message: string, data?: object) => {
        queueLog("warn", message, data);
    },
    debug: (message: string, data?: object) => {
        queueLog("debug", message, data);
    }
};

export default logger;
