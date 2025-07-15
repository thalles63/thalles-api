import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import "reflect-metadata";
import { config } from "./config/app.config";
import { appDataSource } from "./config/database.config";
import apiRoutes from "./routes/api.routes";
import { AppError } from "./utils/errors/errors";
import logger from "./utils/logger/logger";

const app = express();
process.env.TZ = "UTC";

appDataSource
    .initialize()
    .then(() => {
        console.log("Database connection established");
    })
    .catch((error) => {
        console.error("Error connecting to database:", error);
    });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.url.indexOf("api") >= 0 && config.server.env === "PRD") {
        logger.info(`${req.method} ${req.url}`);
    }
    next();
});

app.get("/ping", (req: Request, res: Response) => {
    res.json({ status: "ok", environment: config.server.env });
});

app.use("/api", apiRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
    if (config.server.env === "PRD") {
        logger.error(err);
    }

    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            status: "error",
            message: err.message
        });
        return;
    }

    console.log(err);
    res.status(500).json({
        status: "error",
        message: "Internal server error"
    });
});

export default app;
